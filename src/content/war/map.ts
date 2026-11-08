// The map: kingdoms, territories and where each sits on public/war/map.webp (2634 × 1432 px).
// x/y are pixel positions of the territory's number badge. The page turns them into percentages,
// so the markers stay in place at any zoom or screen size.

export type FactionId = "svaroth" | "kogahara" | "valdyruus";

export const MAP_SIZE = { width: 2634, height: 1432 };

// people = what the kingdom's members are called (the faction buttons on /war); heroes = its For Honor hero pool.
// slug = the kingdom's page, /war/<slug>.
export const factions: Record<FactionId, { name: string; people: string; heroes: string; slug: string; color: string; capital: string }> = {
  svaroth: { name: "Svaroth", people: "Crusaders", heroes: "Knights", slug: "crusaders", color: "#e23b44", capital: "aurelia-sanctum" },
  kogahara: { name: "Kōgahara", people: "Samurai", heroes: "Samurai", slug: "samurai", color: "#f07a1f", capital: "jisei-no-shiro" },
  valdyruus: { name: "Valdyruus", people: "Berserkrs", heroes: "Vikings", slug: "berserkrs", color: "#9a52d6", capital: "valdrheim" },
};

export const factionIds = Object.keys(factions) as FactionId[];

export function factionBySlug(slug: string): FactionId | undefined {
  return factionIds.find((f) => factions[f].slug === slug);
}

export type Territory = {
  id: string;
  name: string;
  number: number | null; // null = capital or neutral ground
  home: FactionId | null; // who holds it when the war starts; null = neutral
  x: number;
  y: number;
  note?: string;
};

export const territories: Territory[] = [
  // Valdyruus — the north
  { id: "valdrheim", name: "Grand Hall of Valdrheim", number: null, home: "valdyruus", x: 1094, y: 190, note: "Capital" },
  { id: "east-belfast", name: "East Belfast", number: 1, home: "valdyruus", x: 1578, y: 352 },
  { id: "jorvik", name: "Jorvik", number: 2, home: "valdyruus", x: 1428, y: 470 },
  { id: "dyflin", name: "Dyflin", number: 3, home: "valdyruus", x: 1164, y: 396 },
  { id: "west-belfast", name: "West Belfast", number: 4, home: "valdyruus", x: 1834, y: 368 },
  { id: "limerick", name: "Limerick", number: 5, home: "valdyruus", x: 2028, y: 292 },
  { id: "yggdrasilheim", name: "Yggdrasilheim", number: 6, home: "valdyruus", x: 2170, y: 554 },
  { id: "mount-glyn", name: "Mount Glyn", number: 7, home: "valdyruus", x: 2164, y: 246 },
  { id: "draig-goch", name: "Draig-Goch", number: 8, home: "valdyruus", x: 1824, y: 146 },
  { id: "ulfsheim", name: "Ulfsheim", number: 9, home: "valdyruus", x: 1568, y: 168 },
  { id: "skjoldvik", name: "Skjoldvik", number: 10, home: "valdyruus", x: 1412, y: 236 },
  { id: "blodborg", name: "Blóðborg", number: 11, home: "valdyruus", x: 740, y: 162 },
  { id: "hrafnsvik", name: "Hrafnsvik", number: 12, home: "valdyruus", x: 892, y: 262 },

  // Svaroth — the western island and the southern coast
  { id: "aurelia-sanctum", name: "Holy City of Aurelia Sanctum", number: null, home: "svaroth", x: 590, y: 610, note: "Capital" },
  { id: "godfreys-march", name: "Godfrey's March", number: 1, home: "svaroth", x: 786, y: 656 },
  { id: "saints-covenant", name: "Saint's Covenant", number: 2, home: "svaroth", x: 416, y: 418 },
  { id: "sunscar-reach", name: "Sunscar Reach", number: 3, home: "svaroth", x: 1258, y: 1008 },
  { id: "sentinels-bastion", name: "Sentinel's Bastion", number: 4, home: "svaroth", x: 782, y: 490 },
  { id: "payens-crossing", name: "Payen's Crossing", number: 5, home: "svaroth", x: 572, y: 460 },
  { id: "gaeavarra", name: "Gaeavarra", number: 6, home: "svaroth", x: 1322, y: 1244 },
  { id: "black-citadel", name: "OK / Black Citadel", number: 7, home: "svaroth", x: 1054, y: 868 },
  { id: "ember-isles", name: "The Ember Isles", number: 8, home: "svaroth", x: 1012, y: 1126 },
  { id: "valoria-crusade", name: "Valoria Crusade", number: 9, home: "svaroth", x: 850, y: 1104 },
  { id: "ravenhold", name: "Ravenhold", number: 10, home: "svaroth", x: 852, y: 936 },
  { id: "ashen-jerusalem", name: "Ashen Jerusalem", number: 11, home: "svaroth", x: 390, y: 850 },
  { id: "sanctum-draconis", name: "Sanctum Draconis", number: 12, home: "svaroth", x: 402, y: 716 },

  // Kōgahara — the east
  { id: "jisei-no-shiro", name: "Jisei no Shiro", number: null, home: "kogahara", x: 1648, y: 720, note: "Capital" },
  { id: "numashiro", name: "Numashiro", number: 1, home: "kogahara", x: 1204, y: 754 },
  { id: "seiryu", name: "Seiryū", number: 2, home: "kogahara", x: 1428, y: 584 },
  { id: "kinzan-jo", name: "Kinzan-jō", number: 3, home: "kogahara", x: 1612, y: 1028 },
  { id: "shinryo-jo", name: "Shinryō-jō", number: 4, home: "kogahara", x: 1864, y: 594 },
  { id: "reizan-no-oshiro", name: "Reizan no Ōshiro", number: 5, home: "kogahara", x: 2060, y: 536 },
  { id: "kaijo-no-kuni", name: "Kaijō no Kuni", number: 6, home: "kogahara", x: 1790, y: 1116 },
  { id: "okawa-no-sato", name: "Ōkawa no Sato", number: 7, home: "kogahara", x: 1556, y: 876 },
  { id: "tetsurei", name: "Tetsurei", number: 8, home: "kogahara", x: 1914, y: 1040 },
  { id: "renshima", name: "Renshima", number: 9, home: "kogahara", x: 2230, y: 670 },
  { id: "tenkyo-jo", name: "Tenkyō-jō", number: 10, home: "kogahara", x: 2126, y: 856 },
  { id: "heigen-no-miyako", name: "Heigen no Miyako", number: 11, home: "kogahara", x: 1870, y: 800 },
  { id: "kuronuma", name: "Kuronuma (Black Marsh)", number: 12, home: "kogahara", x: 1418, y: 762 },

  // Neutral ground
  { id: "grimgarth", name: "Grimgarth", number: null, home: null, x: 1180, y: 620, note: "Neutral" },
  { id: "xibalba", name: "Xibalba", number: null, home: null, x: 710, y: 884, note: "Neutral · Black Market" },
];

const byId = new Map(territories.map((t) => [t.id, t]));

export function findTerritory(id: string): Territory | undefined {
  return byId.get(id);
}

// Accepts an id ("jorvik"), a name ("Jorvík", any case, accents optional) or "valdyruus 2".
export function matchTerritory(input: string): Territory | undefined {
  const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const wanted = plain(input);
  const direct = byId.get(wanted) ?? territories.find((t) => plain(t.name) === wanted);
  if (direct) return direct;
  const numbered = wanted.match(/^([a-z]+)\s*#?(\d+)$/);
  if (numbered) {
    const faction = factionIds.find((f) => plain(factions[f].name) === numbered[1]);
    return territories.find((t) => t.home === faction && t.number === Number(numbered[2]));
  }
  return territories.find((t) => plain(t.name).startsWith(wanted));
}

// Resource sites on the whole map (Hardset Register 2.4: 26 Goldmines, 17 Stone, 13 Forest, 84 Economic, 28 Luxury).
export const resourceTotals = {
  gold: [{ name: "Goldmine", count: 26 }],
  building: [
    { name: "Stone", count: 17 },
    { name: "Forest (Lumber)", count: 13 },
  ],
  economic: [
    { name: "Fish", count: 22 }, { name: "Whales", count: 5 }, { name: "Cattle", count: 10 }, { name: "Grain", count: 1 },
    { name: "Rice", count: 3 }, { name: "Herbs", count: 4 }, { name: "Pelts", count: 10 }, { name: "Furs", count: 7 },
    { name: "Salt", count: 6 }, { name: "Iron", count: 11 }, { name: "Oil", count: 2 }, { name: "Sugar", count: 1 },
    { name: "Textiles", count: 2 },
  ],
  luxury: [
    { name: "Copper", count: 2 }, { name: "Ruby", count: 3 }, { name: "Obsidian", count: 4 }, { name: "Dyes", count: 2 },
    { name: "Diamond", count: 1 }, { name: "Emeralds", count: 1 }, { name: "Jade", count: 3 }, { name: "Pearls", count: 2 },
    { name: "Ivory", count: 4 }, { name: "Silk", count: 1 }, { name: "Incense", count: 3 }, { name: "Wine", count: 2 },
  ],
};
