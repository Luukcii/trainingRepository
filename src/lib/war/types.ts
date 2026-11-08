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
  troops: number | null; // null = secret: only the holding kingdom sees its troops, buildings and obstacles
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

export type WarEventItem = { id: string; at: string; faction: FactionId | null; kind: string; summary: string };

// Who is looking: one kingdom's members, staff (everything), or the public (land and tiers only).
export type WarViewer = FactionId | "all" | null;

export type WarState = {
  source: "live" | "example";
  viewer: WarViewer;
  day: number;
  loadedAt: string;
  factions: Partial<Record<FactionId, FactionStats>>; // only the kingdoms this viewer may see
  territories: Record<string, TerritoryState>;
  movements: Movement[];
  events: WarEventItem[];
};

export const tierNames: Record<Tier, string> = { "town-hall": "Town Hall", castle: "Castle", fortress: "Fortress" };
