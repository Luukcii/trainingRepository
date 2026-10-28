// Lines up the castle glyphs side by side and works out where everything sits in the scene.
import { castleFlags, castleGlyphs } from "./castle-glyphs";

export const C = 10; // one block, in SVG units
export const TOP = C * 2.8; // headroom above the letters for battlements and banners
export const ROWS = 9; // rows 0–8 stand on the ground
export const MARGIN = 10; // open grassland (in columns) left and right of the letters
const LETTER_GAP = 2;
const WORD_GAP = 4;

export const groundY = TOP + ROWS * C; // the baseline, where the grass begins

export type Cell = { col: number; row: number; kind: string };
export type Gap = { col: number; width: number };

export function layoutCastle(text: string) {
  const cells: Cell[] = [];
  const gaps: Gap[] = [];
  const flags: number[] = []; // x positions, in columns
  let col = MARGIN;
  const chars = [...text];

  chars.forEach((char, i) => {
    if (char === " ") {
      gaps.push({ col, width: WORD_GAP });
      col += WORD_GAP;
      return;
    }
    const glyph = castleGlyphs[char];
    if (!glyph) return;
    glyph.forEach((line, row) =>
      [...line].forEach((kind, c) => {
        if (kind !== ".") cells.push({ col: col + c, row, kind });
      }),
    );
    for (const f of castleFlags[char] ?? []) flags.push(col + f);
    col += glyph[0].length;
    const next = chars[i + 1];
    if (next && next !== " ") {
      gaps.push({ col, width: LETTER_GAP });
      col += LETTER_GAP;
    }
  });

  return { cells, gaps, flags, columns: col + MARGIN };
}
