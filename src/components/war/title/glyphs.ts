// The Faction War alphabet: each letter described as the moves a scribe's pen makes.
// Coordinates: x goes right, y goes DOWN. The baseline (where letters sit) is y = 0,
// so letters are drawn upward into negative y. Small letters reach y = -50, capitals y = -80.
//
// Path commands (see lib/pen.ts): M = pen down, L = straight line, C = curve.

export type Glyph = {
  advance: number; // how far to move right before the next letter
  scale?: number; // draw this letter bigger (capitals), without a wider pen
  pen: string[]; // main broad-pen strokes: thick and thin like a quill
  fine?: string[]; // the same pen, much narrower: delicate silver swashes
  hair?: string[]; // gold hairline flourishes, even width
  gems?: [number, number, number][]; // small gold diamonds: x, y, size
};

export const WORD_SPACE = 6;

// Kerning: a nudge for one specific pair of letters, on top of the normal spacing.
// Negative pulls the second letter closer. Real fonts keep a table just like this.
export const KERNING: Record<string, number> = {
  Fa: -11, // the "a" tucks in next to the F, over the right edge of its gold vines
};

export const glyphs: Record<string, Glyph> = {
  // Decorated capital F, framed by the gold vines (see GothicTitle)
  F: {
    advance: 68,
    scale: 1.2,
    pen: [
      // Main stem: diamond head, long slightly bowed stem, tail curling away to the left
      "M 21 -72 L 26 -67 C 26 -48 25 -26 26 -10 C 26.5 -2 21 4 13 4 C 7 4 4 0 5 -4",
      // Top arm
      "M 26 -67 C 32 -74 40 -76 48 -73",
      // Crossbar with a diamond tip
      "M 26 -40 L 44 -43",
      "M 42.5 -42 L 46 -38.5",
    ],
    fine: [
      // Top arm continues as a wave and rolls into a curl
      "M 48 -73 C 56 -70 60 -72 64 -78 C 67 -82 72 -80 71 -75 C 70 -70 64 -70 63 -74",
      // Lead-in swash curling into the head
      "M 21 -72 C 14 -80 4 -78 3 -70 C 2 -62 11 -60 13 -65",
      // Flick from the tail
      "M 5 -4 C 4 -12 12 -16 15 -11",
    ],
    hair: [
      // Spiral tip inside the lead-in curl
      "M 13 -65 C 14 -69 9 -70 8 -67",
      // Curl hanging from the crossbar diamond
      "M 46 -38.5 C 52 -30 50 -20 42 -21 C 37 -22 38 -28 42 -28",
      // Small curl budding off the left of the stem
      "M 25 -30 C 17 -30 13 -24 17 -20 C 20 -17 24 -20 22 -23",
      // Arc over the top arm
      "M 30 -80 C 40 -86 52 -84 60 -80",
      // Sweep along the baseline from the tail
      "M 13 4 C 22 8 34 6 40 0",
    ],
    gems: [
      [40, -56, 2],
      [10, -46, 1.6],
      [56, -60, 1.6],
    ],
  },

  W: {
    advance: 75,
    scale: 1.15,
    pen: [
      // First thick down-stroke, with a diamond head
      "M 6 -70 L 11 -74 L 15 -69 C 19 -46 24 -22 32 -2",
      // Thin up-stroke
      "M 32 -2 C 36 -22 40 -40 45 -57",
      // Second thick down-stroke, with a diamond head
      "M 41 -60 L 46 -64 L 50 -59 C 53 -38 57 -18 63 -2",
      // Last up-stroke
      "M 63 -2 C 68 -24 73 -46 78 -64",
    ],
    fine: [
      // Last stroke rolls over into a curl at the top right
      "M 78 -64 C 80 -72 86 -76 91 -72 C 96 -67 93 -58 86 -59 C 82 -60 82 -65 86 -65",
      // Swoop joining the two bottom points
      "M 32 -2 C 38 7 56 7 63 -2",
    ],
    hair: [
      // Spiral curl leading into the first head
      "M 6 -70 C -2 -74 -6 -84 2 -87 C 9 -89 14 -82 9 -78",
      // Fine line beside the first thick stroke
      "M 9 -60 C 13 -42 18 -24 25 -9",
      // Spiral tip inside the top-right curl
      "M 86 -65 C 88 -63 87 -61 85 -62",
      // Drop from the bottom swoop
      "M 47.5 5 C 47.5 10 44 13 40 12",
    ],
    gems: [
      [46, -74, 2],
      [76, -10, 1.6],
      [97, -80, 1.4],
    ],
  },

  a: {
    advance: 27,
    pen: [
      // Top bow and right stem with a diamond foot
      "M 4 -44 L 9 -50 L 20 -45.5 L 20 -3.5 L 23.5 0",
      // Lower bowl
      "M 20 -33 L 9 -29 L 5.5 -25.5 L 5.5 -4.5 L 9.5 0 L 20 -4",
    ],
  },

  c: {
    advance: 23,
    pen: [
      // Left side and bottom
      "M 9.5 -50 L 5.5 -46 L 5.5 -4.5 L 9.5 0 L 19 -3.5",
      // Roof with a small flag
      "M 9.5 -50 L 18.5 -46 L 18.5 -40",
    ],
    hair: ["M 18.5 -40 C 19.5 -36 22 -36 23 -39"],
  },

  t: {
    advance: 20,
    pen: [
      // Stem rising a little above the small letters, diamond foot, hairline exit
      "M 6 -60 L 6 -3.5 L 9.5 0 L 15 -4.5",
      // Crossbar
      "M 2.5 -46 L 13.5 -48.5",
    ],
  },

  i: {
    advance: 14,
    pen: [
      // Diamond head, stem, diamond foot
      "M 2 -50 L 5.5 -46.5 L 5.5 -3.5 L 9 0",
      // The dot: a single diamond
      "M 3.5 -61 L 7 -57.5",
    ],
  },

  o: {
    advance: 27,
    pen: [
      // One closed six-sided loop: thick stems, thick slanted roof and floor
      "M 9.5 -50.5 L 5.5 -46 L 5.5 -4.5 L 9.5 0.5 L 20 -4 L 20 -45 L 9.5 -50.5",
    ],
  },

  n: {
    advance: 28,
    pen: [
      // First stem
      "M 2 -50 L 5.5 -46.5 L 5.5 0",
      // Hairline up, thick roof, second stem with a diamond foot
      "M 5.5 -44 L 10 -50.5 L 20 -45.5 L 20 -3.5 L 23.5 0",
    ],
  },

  r: {
    advance: 20,
    pen: [
      // Stem
      "M 2 -50 L 5.5 -46.5 L 5.5 0",
      // Flag at the top right
      "M 5.5 -44 L 10 -50.5 L 17 -47.5 L 18 -42",
    ],
    hair: ["M 18 -42 C 19 -38 22 -37 24 -40"],
  },
};
