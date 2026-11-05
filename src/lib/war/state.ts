// Reads the war from the database for the map. Before the war is set up (or if the war tables don't
// exist yet), it returns the example state instead, marked as such, so the map never breaks.
import { and, desc, eq, gte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { warEvent, warFaction, warMovement, warSetting, warTerritory } from "@/lib/db/schema";
import { factionIds, territories, type FactionId } from "@/content/war/map";
import { exampleWarState } from "./example";
import type { FactionStats, Movement, TerritoryState, Tier, WarState } from "./types";

const RECENT_MS = 24 * 3_600_000; // finished movements stay on the map for a day

const isFaction = (value: string | null): value is FactionId => factionIds.includes(value as FactionId);

export async function loadWarState(): Promise<WarState> {
  try {
    return (await loadLiveState()) ?? exampleWarState();
  } catch (error) {
    // Never log the raw error: database errors can contain the connection string.
    console.warn("war map: live state unavailable, showing example data", error instanceof Error ? error.name : "unknown");
    return exampleWarState();
  }
}

async function loadLiveState(): Promise<WarState | null> {
  const since = new Date(Date.now() - RECENT_MS);
  const [factionRows, territoryRows, movementRows, eventRows, dayRow] = await Promise.all([
    db.select().from(warFaction),
    db.select().from(warTerritory),
    // Only public movements: secret ones (smuggled Envoys, hidden ambushes) never leave the server.
    db
      .select()
      .from(warMovement)
      .where(and(eq(warMovement.secret, false), or(eq(warMovement.status, "moving"), gte(warMovement.arrivesAt, since))))
      .orderBy(desc(warMovement.departsAt))
      .limit(100),
    db.select().from(warEvent).where(eq(warEvent.secret, false)).orderBy(desc(warEvent.at)).limit(20),
    db.select().from(warSetting).where(eq(warSetting.key, "day")),
  ]);

  if (factionRows.length === 0) return null; // the war hasn't been set up yet

  const factionsOut = {} as Record<FactionId, FactionStats>;
  for (const id of factionIds) {
    const row = factionRows.find((r) => r.id === id);
    factionsOut[id] = {
      gold: row?.gold ?? 0,
      troops: row?.troops ?? 0,
      stone: row?.stone ?? 0,
      lumber: row?.lumber ?? 0,
      faith: row?.faith ?? 0,
      fame: row?.fame ?? 0,
      trade: row?.trade ?? 0,
      ap: row?.ap ?? 0,
    };
  }

  const territoriesOut: Record<string, TerritoryState> = {};
  for (const t of territories) {
    const row = territoryRows.find((r) => r.id === t.id);
    territoriesOut[t.id] = {
      owner: row ? (isFaction(row.owner) ? row.owner : null) : t.home,
      tier: (row?.tier as Tier) ?? "town-hall",
      troops: row?.troops ?? 0,
      buildings: row?.buildings ?? [],
      obstacles: row?.obstacles ?? [],
    };
  }

  const movements: Movement[] = movementRows
    .filter((m) => isFaction(m.faction))
    .map((m) => ({
      id: m.id,
      kind: m.kind as Movement["kind"],
      faction: m.faction as FactionId,
      from: m.fromId,
      to: m.toId,
      cargo: m.cargo,
      troops: m.troops,
      departsAt: m.departsAt.toISOString(),
      arrivesAt: m.arrivesAt.toISOString(),
      status: m.status as Movement["status"],
    }));

  return {
    source: "live",
    day: Number(dayRow[0]?.value ?? 1),
    loadedAt: new Date().toISOString(),
    factions: factionsOut,
    territories: territoriesOut,
    movements,
    events: eventRows.map((e) => ({
      id: e.id,
      at: e.at.toISOString(),
      faction: isFaction(e.faction) ? e.faction : null,
      summary: e.summary,
    })),
  };
}
