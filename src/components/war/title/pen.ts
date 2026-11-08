// A scribe's broad-edged pen, simulated.
// A quill is cut flat, like a chisel. Held at a fixed slant, it leaves a thick line when moving
// one way and a hairline when moving another: that contrast is what makes gothic lettering gothic.
// We give it a centerline (the path the hand moves along) and get back the ink shape it leaves.

type Point = [number, number];

const CURVE_STEPS = 20; // how finely curves are traced: more = smoother, but more data

// Read a centerline written like an SVG path, absolute commands only:
//   M x y            put the pen down here
//   L x y            straight line to here
//   C x1 y1 x2 y2 x y  curve to (x, y), bending toward the two middle points
// Returns runs of points; each new "M" lifts the pen and starts a new run.
function trace(d: string): Point[][] {
  const tokens = d.match(/[MLC]|-?\d*\.?\d+/g) ?? [];
  const runs: Point[][] = [];
  let cmd = "";
  let i = 0;
  const num = () => Number(tokens[i++]);

  while (i < tokens.length) {
    if (/^[MLC]$/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === "M") {
      runs.push([[num(), num()]]);
      cmd = "L"; // numbers right after M continue as lines, like in SVG
    } else if (cmd === "L") {
      runs[runs.length - 1].push([num(), num()]);
    } else if (cmd === "C") {
      const run = runs[runs.length - 1];
      const [x0, y0] = run[run.length - 1];
      const [x1, y1, x2, y2, x3, y3] = [num(), num(), num(), num(), num(), num()];
      for (let s = 1; s <= CURVE_STEPS; s++) {
        const t = s / CURVE_STEPS;
        const u = 1 - t;
        const [a, b, c, e] = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
        run.push([a * x0 + b * x1 + c * x2 + e * x3, a * y0 + b * y1 + c * y2 + e * y3]);
      }
    } else {
      throw new Error(`Pen can't read "${tokens[i]}" in "${d}"`);
    }
  }
  return runs;
}

// Signed area of a polygon: positive or negative depending on which way round it goes.
function area(poly: Point[]): number {
  let sum = 0;
  for (let k = 0; k < poly.length; k++) {
    const [x1, y1] = poly[k];
    const [x2, y2] = poly[(k + 1) % poly.length];
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * The ink shape a flat pen leaves when moved along the given centerlines.
 * @param strokes centerlines, one string per pen stroke
 * @param nib     width of the pen tip (bigger = bolder letters)
 * @param angle   slant of the pen tip in degrees; -45 = tip pointing up-right, the classic scribe's angle
 * @param scale   enlarge the letter's path without making the pen any wider
 * @returns SVG path data, ready for <path d=...>
 */
export function broadPen(strokes: string[], nib: number, angle = -45, scale = 1): string {
  const rad = (angle * Math.PI) / 180;
  const hx = (Math.cos(rad) * nib) / 2;
  const hy = (Math.sin(rad) * nib) / 2;
  const parts: string[] = [];

  for (const d of strokes) {
    for (const run of trace(d)) {
      // Between every two points, the flat tip sweeps out a four-sided patch.
      // All the patches together are the stroke.
      for (let k = 1; k < run.length; k++) {
        const [px, py] = [run[k - 1][0] * scale, run[k - 1][1] * scale];
        const [qx, qy] = [run[k][0] * scale, run[k][1] * scale];
        let patch: Point[] = [
          [px - hx, py - hy],
          [px + hx, py + hy],
          [qx + hx, qy + hy],
          [qx - hx, qy - hy],
        ];
        // Turn every patch the same way round, so overlapping patches add up instead of cancelling out.
        if (area(patch) < 0) patch = patch.reverse();
        parts.push("M" + patch.map(([x, y]) => `${round(x)} ${round(y)}`).join("L") + "Z");
      }
    }
  }
  return parts.join("");
}
