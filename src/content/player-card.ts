// The parts a member can pick for their player card. The database stores only the keys ("ember", "wolf"…),
// so nobody can sneak their own CSS onto the page. To add an option, add an entry here.

export const banners = {
  stone: { label: "Stone", background: "repeating-linear-gradient(0deg, #3b3f45 0 22px, #2b2e33 22px 24px), #3b3f45" },
  ember: { label: "Ember", background: "linear-gradient(135deg, #2b0a0a, #8b1e1e 55%, #f39c12)" },
  night: {
    label: "Night",
    background: "radial-gradient(#ffffff66 1px, transparent 1.5px) 0 0 / 18px 18px, linear-gradient(135deg, #0b1026, #283a7a)",
  },
  forest: { label: "Forest", background: "linear-gradient(160deg, #0f2e1d, #2e6b3f 60%, #9bc26b)" },
  desert: { label: "Desert", background: "linear-gradient(170deg, #f6d28b, #c98a3a 60%, #7a4a1e)" },
  ice: { label: "Ice", background: "linear-gradient(135deg, #e6f7ff, #7fc8ec 50%, #2a6f97)" },
  crimson: { label: "Crimson", background: "repeating-linear-gradient(45deg, #5a0e0e 0 14px, #7a1515 14px 28px)" },
  royal: {
    label: "Royal",
    background: "linear-gradient(transparent 44%, #d4a017aa 44% 56%, transparent 56%), linear-gradient(90deg, #1a237e, #4a148c)",
  },
  hazard: { label: "Hazard", background: "repeating-linear-gradient(-45deg, #151515 0 16px, #d4a017 16px 32px)" },
  dusk: { label: "Dusk", background: "linear-gradient(180deg, #2d1b4e, #c2477a 60%, #f7a35c)" },
} as const;

export const emblemColors = {
  gold: { label: "Gold", hex: "#d4a017" },
  crimson: { label: "Crimson", hex: "#c0392b" },
  royal: { label: "Royal blue", hex: "#2e5aac" },
  emerald: { label: "Emerald", hex: "#2e8b57" },
  violet: { label: "Violet", hex: "#7d3cff" },
  orange: { label: "Orange", hex: "#e67e22" },
  ice: { label: "Ice", hex: "#7fd3ff" },
  steel: { label: "Steel", hex: "#8a9099" },
  obsidian: { label: "Obsidian", hex: "#2b2b2b" },
} as const;

// 12×12 pixel drawings, like the knights. x = the chosen color, d = dark outline, w = white, s = steel.
export const emblems = {
  shield: {
    label: "Shield",
    sprite: [
      ".dddddddddd.",
      ".dxxxxwxxxd.",
      ".dxxxxwxxxd.",
      ".dxxxxwxxxd.",
      ".dwwwwwwwwd.",
      ".dxxxxwxxxd.",
      ".dxxxxwxxxd.",
      "..dxxxwxxd..",
      "..dxxxwxxd..",
      "...dxxwxd...",
      "....dxxd....",
      ".....dd.....",
    ],
  },
  crown: {
    label: "Crown",
    sprite: [
      "............",
      "............",
      ".w...ww...w.",
      ".x...xx...x.",
      ".xx.xxxx.xx.",
      ".xxxxxxxxxx.",
      ".xxwxxxxwxx.",
      ".xxxxxxxxxx.",
      ".dddddddddd.",
      "............",
      "............",
      "............",
    ],
  },
  sword: {
    label: "Sword",
    sprite: [
      ".....ws.....",
      ".....ws.....",
      ".....ws.....",
      ".....ws.....",
      ".....ws.....",
      ".....ws.....",
      ".....ws.....",
      "..xxxxxxxx..",
      "..dddddddd..",
      ".....dd.....",
      ".....dd.....",
      "....xxxx....",
    ],
  },
  wolf: {
    label: "Wolf",
    sprite: [
      "..d......d..",
      "..dd....dd..",
      "..dxd..dxd..",
      "..dxxddxxd..",
      ".dxxxxxxxxd.",
      ".dxwdxxdwxd.",
      ".dxxxxxxxxd.",
      "..dxxxxxxd..",
      "...dxwwxd...",
      "...dxddxd...",
      "....dxxd....",
      ".....dd.....",
    ],
  },
  skull: {
    label: "Skull",
    sprite: [
      "...dddddd...",
      "..dwwwwwwd..",
      ".dwwwwwwwwd.",
      ".dwwwwwwwwd.",
      ".dwxxwwxxwd.",
      ".dwxxwwxxwd.",
      ".dwwwwwwwwd.",
      "..dwwwdwwd..",
      "...dwwwwd...",
      "...dwdwdd...",
      "...dddddd...",
      "............",
    ],
  },
  castle: {
    label: "Castle",
    sprite: [
      "............",
      ".x.x.xx.x.x.",
      ".xxxxxxxxxx.",
      ".xxxxxxxxxx.",
      "..xxxxxxxx..",
      "..xxdxxdxx..",
      "..xxxxxxxx..",
      "..xxxxxxxx..",
      "..xxxddxxx..",
      "..xxddddxx..",
      "..xxddddxx..",
      ".dddddddddd.",
    ],
  },
  star: {
    label: "Star",
    sprite: [
      ".....ww.....",
      ".....xx.....",
      "....xxxx....",
      "xxxxxxxxxxxx",
      ".xxxxxxxxxx.",
      "..xxxxxxxx..",
      "...xxxxxx...",
      "...xxxxxx...",
      "..xxx..xxx..",
      "..xx....xx..",
      ".xx......xx.",
      "............",
    ],
  },
  flame: {
    label: "Flame",
    sprite: [
      ".....x......",
      ".....xx.....",
      "....xxx.....",
      "....xxxx..x.",
      "...xxxxx.xx.",
      "..xxxwxxxxx.",
      "..xxwwxxxxx.",
      ".xxxwwwxxxx.",
      ".xxwwwwwxxx.",
      ".xxwwwwwxxx.",
      "..xxwwwxxx..",
      "...xxxxxx...",
    ],
  },
} as const;

export type BannerKey = keyof typeof banners;
export type EmblemKey = keyof typeof emblems;
export type ColorKey = keyof typeof emblemColors;

export type PlayerCardLook = { banner: BannerKey; emblem: EmblemKey; color: ColorKey };
export const defaultLook: PlayerCardLook = { banner: "stone", emblem: "shield", color: "gold" };

// The database could hold an old key we later removed; fall back instead of crashing.
export function safeLook(row: { banner: string; emblem: string; color: string } | null | undefined): PlayerCardLook {
  return {
    banner: row && row.banner in banners ? (row.banner as BannerKey) : defaultLook.banner,
    emblem: row && row.emblem in emblems ? (row.emblem as EmblemKey) : defaultLook.emblem,
    color: row && row.color in emblemColors ? (row.color as ColorKey) : defaultLook.color,
  };
}
