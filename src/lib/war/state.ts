// Reads the war from the database for the map. Before the war is set up (or if the war tables don't
// exist yet), it returns the example state instead, marked as such, so the map never breaks.
import { and, desc, eq, gte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { warEvent, warFaction, warMovement, warSetting, warTerritory } from "@/lib/db/schema";
import { factionIds, territories, type FactionId } from "@/content/war/map";
import { exampleWarState } from "./example";
import type { FactionStats, Movement, TerritoryState, Tier, WarState, WarViewer } from "./types";

const RECENT_MS = 24 * 3_600_000; // finished movements stay on the map for a day

const isFaction = (value: string | null): value is FactionId => factionIds.includes(value as FactionId);

// The war as one viewer may see it. Every caller passes who is looking; nothing leaves this file unfiltered.
export async function loadWarState(viewer: WarViewer): Promise<WarState> {
  let full: WarState;
  try {
    full = (await loadLiveState()) ?? exampleWarState();
  } catch (error) {
    // Never log the raw error: database errors can contain the connection string.
    console.warn("war map: live state unavailable, showing example data", error instanceof Error ? error.name : "unknown");
    full = exampleWarState();
  }
  return scopeWarState(full, viewer);
}

// Fog of war (Hardset Register: information is valuable; Envoys are found by espionage, decision 75;
// rivals only see the weekly totals, decision 142). Everyone sees who holds each territory and its tier.
// A kingdom's members also see their own numbers, the troops, buildings and obstacles on their own land,
// their own movements, Attacks on their land, and their own news. Staff ("all") see everything public.
// Kinds of war-log line that every visitor may read.
export const announcementKinds = ["setup", "day", "ruling"] as const;
export const isAnnouncement = (kind: string) => (announcementKinds as readonly string[]).includes(kind);

export function scopeWarState(state: WarState, viewer: WarViewer): WarState {
  if (viewer === "all") return { ...state, viewer };
  const mine = (owner: FactionId | null) => viewer !== null && owner === viewer;

  const territoriesOut: Record<string, TerritoryState> = {};
  for (const [id, t] of Object.entries(state.territories)) {
    territoriesOut[id] = mine(t.owner) ? t : { owner: t.owner, tier: t.tier, troops: null, buildings: [], obstacles: [] };
  }
  const factionsOut: WarState["factions"] = {};
  if (viewer && state.factions[viewer]) factionsOut[viewer] = state.factions[viewer];

  return {
    ...state,
    viewer,
    factions: factionsOut,
    territories: territoriesOut,
    movements: viewer
      ? state.movements.filter((m) => m.faction === viewer || (m.kind === "attack" && mine(state.territories[m.to]?.owner ?? null)))
      : [],
    // Announcements (war start, new day, mods' rulings) are for everyone; the rest only for its own kingdom.
    events: state.events.filter((e) => isAnnouncement(e.kind) || (viewer && e.faction === viewer)),
  };
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

  const factionsOut: Record<FactionId, FactionStats> = {} as Record<FactionId, FactionStats>;
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
    viewer: "all",
    day: Number(dayRow[0]?.value ?? 1),
    loadedAt: new Date().toISOString(),
    factions: factionsOut,
    territories: territoriesOut,
    movements,
    events: eventRows.map((e) => ({
      id: e.id,
      at: e.at.toISOString(),
      faction: isFaction(e.faction) ? e.faction : null,
      kind: e.kind,
      summary: e.summary,
    })),
  };
}
