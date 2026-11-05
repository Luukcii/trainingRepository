// The shape of the war at one moment, as the map receives it. Plain data, safe to send to a browser:
// secret movements and events are removed on the server before this ever leaves it.
import type { FactionId } from "@/content/war/map";

export type Tier = "town-hall" | "castle" | "fortress";
export type MovementKind = "envoy" | "attack" | "ambush" | "raid";
export type MovementStatus = "moving" | "arrived" | "won" | "lost" | "cancelled";

export type FactionStats = {
  gold: number;
  troops: number;
  stone: number;
  lumber: number;
  faith: number;
  fame: number;
  trade: number;
  ap: number;
};

export type TerritoryState = {
  owner: FactionId | null;
  tier: Tier;
  troops: number;
  buildings: string[];
  obstacles: string[];
};

export type Movement = {
  id: string;
  kind: MovementKind;
  faction: FactionId;
  from: string;
  to: string;
  cargo: string;
  troops: number;
  departsAt: string; // ISO time
  arrivesAt: string;
  status: MovementStatus;
};

export type WarEventItem = { id: string; at: string; faction: FactionId | null; summary: string };

export type WarState = {
  source: "live" | "example";
  day: number;
  loadedAt: string;
  factions: Record<FactionId, FactionStats>;
  territories: Record<string, TerritoryState>;
  movements: Movement[];
  events: WarEventItem[];
};

export const tierNames: Record<Tier, string> = { "town-hall": "Town Hall", castle: "Castle", fortress: "Fortress" };
