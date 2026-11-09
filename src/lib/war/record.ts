// Every change to the war goes through here, and each one writes a line in the war logbook.
// Only the Discord bot's staff commands call these, after checking who is asking.
import { randomInt, randomUUID } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { warEvent, warFaction, warMovement, warSetting, warTerritory } from "@/lib/db/schema";
import { factionIds, factions, findTerritory, territories, type FactionId } from "@/content/war/map";
import type { MovementKind, MovementStatus, Tier } from "./types";

export const statKeys = ["gold", "troops", "stone", "lumber", "faith", "fame", "trade", "ap"] as const;
export type StatKey = (typeof statKeys)[number];

const statColumn = {
  gold: warFaction.gold,
  troops: warFaction.troops,
  stone: warFaction.stone,
  lumber: warFaction.lumber,
  faith: warFaction.faith,
  fame: warFaction.fame,
  trade: warFaction.trade,
  ap: warFaction.ap,
};

async function logEvent(actor: string, faction: FactionId | null, kind: string, summary: string, secret = false) {
  await db.insert(warEvent).values({ id: randomUUID(), actor, faction, kind, summary, secret });
}

// Short codes people can type: no 0/O or 1/I to mix up.
function movementCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => letters[randomInt(letters.length)]).join("");
}

export async function isWarSetUp() {
  const rows = await db.select({ id: warFaction.id }).from(warFaction).limit(1);
  return rows.length > 0;
}

// Day one: every kingdom gets 75,000 Gold and its home territories at Town Hall. Refuses if a war exists,
// so a mistyped command can never wipe a war in progress.
export async function setUpWar(actor: string) {
  if (await isWarSetUp()) return false;
  await db.insert(warFaction).values(factionIds.map((id) => ({ id })));
  await db.insert(warTerritory).values(territories.map((t) => ({ id: t.id, owner: t.home })));
  await db.insert(warSetting).values({ key: "day", value: "1" }).onConflictDoUpdate({ target: warSetting.key, set: { value: "1" } });
  await logEvent(actor, null, "setup", "The war begins. Day 1.");
  return true;
}

// A mod chooses who answers /war ask: God (cheap), Odin (wise) or nobody. Staff-only log line.
export async function recordGodMind(actor: string, mind: string, label: string) {
  await db.insert(warSetting).values({ key: "god_mind", value: mind }).onConflictDoUpdate({ target: warSetting.key, set: { value: mind } });
  await logEvent(actor, null, "setting", `/war ask answered by: ${label}.`);
}

export async function setDay(actor: string, day: number) {
  await db.insert(warSetting).values({ key: "day", value: String(day) }).onConflictDoUpdate({ target: warSetting.key, set: { value: String(day) } });
  await logEvent(actor, null, "day", `Day ${day} begins.`);
}

export async function changeStat(actor: string, faction: FactionId, stat: StatKey, amount: number, mode: "add" | "set", reason: string) {
  const column = statColumn[stat];
  const value = mode === "add" ? sql`${column} + ${amount}` : sql`${amount}`;
  const [row] = await db
    .update(warFaction)
    .set({ [stat]: value, updatedAt: new Date() })
    .where(eq(warFaction.id, faction))
    .returning({ value: column });
  if (!row) return null;
  const verb = mode === "set" ? `set to ${amount.toLocaleString("en")}` : `${amount >= 0 ? "+" : ""}${amount.toLocaleString("en")}`;
  await logEvent(actor, faction, "stat", `${factions[faction].name} ${stat} ${verb}${reason ? ` (${reason})` : ""}. Now ${Number(row.value).toLocaleString("en")}.`);
  return Number(row.value);
}

export async function getTerritoryRow(id: string) {
  const [row] = await db.select().from(warTerritory).where(eq(warTerritory.id, id));
  return row ?? null;
}

export async function updateTerritory(
  actor: string,
  id: string,
  change: { owner?: FactionId | null; tier?: Tier; troops?: number; buildings?: string[]; obstacles?: string[] },
  summary: string,
) {
  const [row] = await db.update(warTerritory).set({ ...change, updatedAt: new Date() }).where(eq(warTerritory.id, id)).returning();
  if (!row) return null;
  const owner = change.owner ?? (row.owner as FactionId | null);
  await logEvent(actor, owner, "territory", summary);
  return row;
}

export async function startMovement(
  actor: string,
  m: { kind: MovementKind; faction: FactionId; from: string; to: string; hours: number; troops: number; cargo: string; secret: boolean },
) {
  const id = movementCode();
  const departsAt = new Date();
  const arrivesAt = new Date(departsAt.getTime() + m.hours * 3_600_000);
  await db.insert(warMovement).values({
    id,
    kind: m.kind,
    faction: m.faction,
    fromId: m.from,
    toId: m.to,
    troops: m.troops,
    cargo: m.cargo,
    departsAt,
    arrivesAt,
    secret: m.secret,
    createdBy: actor,
  });
  const verb = { envoy: "sends an Envoy", attack: "attacks", ambush: "sets an ambush", raid: "raids" }[m.kind];
  const from = findTerritory(m.from)?.name;
  const to = findTerritory(m.to)?.name;
  const what = m.kind === "envoy" ? ` from ${from} to ${to}` : m.kind === "ambush" ? ` near ${to}` : ` ${to} from ${from}`;
  await logEvent(actor, m.faction, m.kind, `${factions[m.faction].name} ${verb}${what}${m.troops ? ` with ${m.troops.toLocaleString("en")} troops` : ""}.`, m.secret);
  return { id, arrivesAt };
}

export async function getMovement(id: string) {
  const [row] = await db.select().from(warMovement).where(eq(warMovement.id, id.toUpperCase()));
  return row ?? null;
}

export async function resolveMovement(actor: string, id: string, status: Exclude<MovementStatus, "moving">, note: string) {
  const movement = await getMovement(id);
  if (!movement) return null;
  // A fought battle becomes public knowledge; a quiet arrival or a called-off plan stays as it was.
  const reveal = status === "won" || status === "lost";
  await db.update(warMovement).set({ status, secret: reveal ? false : movement.secret }).where(eq(warMovement.id, movement.id));
  const name = factions[movement.faction as FactionId]?.name ?? movement.faction;
  const to = findTerritory(movement.toId)?.name;
  const label = { arrived: "arrives at", won: "wins at", lost: "is beaten at", cancelled: "calls off the move on" }[status];
  await logEvent(
    actor,
    movement.faction as FactionId,
    "resolve",
    `${name}'s ${movement.kind} ${movement.id} ${label} ${to}${note ? ` (${note})` : ""}.`,
    reveal ? false : movement.secret,
  );
  return movement;
}

export async function revealMovement(actor: string, id: string) {
  const movement = await getMovement(id);
  if (!movement) return null;
  await db.update(warMovement).set({ secret: false }).where(eq(warMovement.id, movement.id));
  await logEvent(actor, movement.faction as FactionId, "reveal", `${movement.kind} ${movement.id} is discovered.`);
  return movement;
}

// A ruling from the mods, in their words. God announces it in Discord; it stays in the war log for good,
// and Claude copies new rulings into the Hardset Register at the next session (the Register is Max's file,
// on his computer, which the bot can't reach).
export async function recordRuling(actor: string, text: string) {
  await logEvent(actor, null, "ruling", `Ruling: ${text}`);
}

export async function recentEvents(limit: number, includeSecret: boolean) {
  const query = db.select().from(warEvent);
  return (includeSecret ? query : query.where(eq(warEvent.secret, false))).orderBy(desc(warEvent.at)).limit(limit);
}
