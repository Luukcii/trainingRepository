// Who is looking at the war, decided on the server from the login session (never from the browser).
// Staff (admin, mods, techs) see everything; a player sees their own kingdom; everyone else sees the public map.
import { factionIds, type FactionId } from "@/content/war/map";
import { getWarUser } from "@/lib/session";
import type { WarViewer } from "./types";
import { isWarStaffRole } from "./roles";

export async function currentViewer(): Promise<WarViewer> {
  const me = await getWarUser();
  if (!me) return null;
  if (isWarStaffRole(me.role)) return "all"; // admin, mods and techs: mod mode
  if (me.role === "player" && factionIds.includes(me.warFaction as FactionId)) return me.warFaction as FactionId;
  return null;
}
