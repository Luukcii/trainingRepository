// Made-up numbers so the map has something to show before the Discord bot records a real war.
// Every page that shows these says "Example data". Times are relative to now, so movements are always mid-journey.
import { factionIds, territories, type FactionId } from "@/content/war/map";
import type { Movement, TerritoryState, WarState } from "./types";

export function exampleWarState(now = Date.now()): WarState {
  const at = (hours: number) => new Date(now + hours * 3_600_000).toISOString();

  const owned: Record<string, Partial<TerritoryState>> = {
    "aurelia-sanctum": { tier: "castle", troops: 1800, buildings: ["Barracks", "Church"] },
    "jisei-no-shiro": { tier: "castle", troops: 1500, buildings: ["Barracks"], obstacles: ["Aegis"] },
    valdrheim: { tier: "castle", troops: 2100, buildings: ["Barracks", "Church"] },
    numashiro: { owner: "valdyruus", troops: 400 }, // taken by the Vikings on day 4
    "kinzan-jo": { owner: "svaroth", troops: 300, buildings: [] }, // taken by the Knights on day 5
    "sunscar-reach": { tier: "castle", troops: 900, obstacles: ["Plague"] },
    dyflin: { troops: 500, buildings: ["Road"] },
    "saints-covenant": { troops: 150 },
  };

  const territoryState: Record<string, TerritoryState> = {};
  for (const t of territories) {
    const o = owned[t.id] ?? {};
    territoryState[t.id] = {
      owner: o.owner ?? t.home,
      tier: o.tier ?? "town-hall",
      troops: o.troops ?? (t.home ? 200 : 0),
      buildings: o.buildings ?? [],
      obstacles: o.obstacles ?? [],
    };
  }

  const movements: Movement[] = [
    { id: "EX1", kind: "envoy", faction: "valdyruus", from: "valdrheim", to: "dyflin", cargo: "Troops", troops: 600, departsAt: at(-3), arrivesAt: at(5), status: "moving" },
    { id: "EX2", kind: "envoy", faction: "kogahara", from: "jisei-no-shiro", to: "seiryu", cargo: "Iron ×40", troops: 0, departsAt: at(-1), arrivesAt: at(2), status: "moving" },
    { id: "EX3", kind: "attack", faction: "svaroth", from: "kinzan-jo", to: "okawa-no-sato", cargo: "", troops: 500, departsAt: at(-0.5), arrivesAt: at(1.5), status: "moving" },
    { id: "EX4", kind: "ambush", faction: "kogahara", from: "seiryu", to: "dyflin", cargo: "Lying in wait for an Envoy", troops: 300, departsAt: at(-2), arrivesAt: at(4), status: "moving" },
    { id: "EX5", kind: "raid", faction: "valdyruus", from: "hrafnsvik", to: "saints-covenant", cargo: "Grain", troops: 250, departsAt: at(-7), arrivesAt: at(-4), status: "won" },
    { id: "EX6", kind: "attack", faction: "kogahara", from: "okawa-no-sato", to: "sunscar-reach", cargo: "", troops: 400, departsAt: at(-10), arrivesAt: at(-8), status: "lost" },
  ];

  const stats = (gold: number, troops: number, stone: number, lumber: number, faith: number, fame: number, trade: number) => ({
    gold, troops, stone, lumber, faith, fame, trade, ap: 2,
  });
  const factionStats: Record<FactionId, NonNullable<WarState["factions"][FactionId]>> = {
    svaroth: stats(61_400, 5_200, 900, 750, 3_150, 2_400, 38_500),
    kogahara: stats(54_900, 4_600, 600, 1_100, 2_200, 3_050, 31_200),
    valdyruus: stats(68_200, 6_100, 1_250, 500, 1_400, 2_750, 44_800),
  };
  if (Object.keys(factionStats).length !== factionIds.length) throw new Error("example data is missing a kingdom");

  return {
    source: "example",
    viewer: "all",
    day: 6,
    loadedAt: new Date(now).toISOString(),
    factions: factionStats,
    territories: territoryState,
    movements,
    events: [
      { id: "ev1", at: at(-0.5), faction: "svaroth", summary: "Svaroth marches on Ōkawa no Sato from Kinzan-jō." },
      { id: "ev2", at: at(-3), faction: "valdyruus", summary: "Valdyruus sends an Envoy of 600 troops to Dyflin." },
      { id: "ev3", at: at(-4), faction: "valdyruus", summary: "Viking raiders take Grain from Saint's Covenant." },
      { id: "ev4", at: at(-8), faction: "svaroth", summary: "Sunscar Reach holds against Kōgahara." },
      { id: "ev5", at: at(-30), faction: "svaroth", summary: "Svaroth captures Kinzan-jō." },
    ],
  };
}
