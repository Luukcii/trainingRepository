// Who is looking at the war, decided on the server from the login session (never from the browser).
// Staff (site admins) see everything; a player sees their own kingdom; everyone else sees the public map.
import { factionIds, type FactionId } from "@/content/war/map";
import { getWarUser } from "@/lib/session";
import type { WarViewer } from "./types";

export async function currentViewer(): Promise<WarViewer> {
  const me = await getWarUser();
  if (!me) return null;
  if (me.role === "admin") return "all";
  if (me.role === "player" && factionIds.includes(me.warFaction as FactionId)) return me.warFaction as FactionId;
  return null;
}
