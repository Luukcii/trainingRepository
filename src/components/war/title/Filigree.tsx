import type { SVGProps } from "react";

// Gold swirls (filigree) drawn around a decorated first letter, like an illuminated manuscript.
// Pure SVG: lines described by coordinates on a 200×200 grid, so it stays sharp at any size.

// Each vine is one curving line. "M" = start point, "C" = curve (two bend points, then the end point).
const vines = [
  // Main vine sweeping up the left side and over the top, ending in a curl
  "M78 178 C30 172 12 120 34 80 C52 46 96 26 140 34 C166 39 174 66 154 74 C138 80 130 62 143 57",
  // Lower vine curling round the bottom right (its right edge passes behind the "a" after the F)
  "M78 178 C108 190 148 182 166 160 C173 142 165 120 156 121 C143 122 141 138 152 141",
  // Small spirals budding off the vines
  "M36 76 C20 62 24 34 46 34 C60 35 61 52 50 53",
  "M20 122 C2 128 2 156 22 156 C34 156 35 142 26 140",
  "M104 30 C98 12 122 2 132 15 C137 23 129 31 121 26",
  "M166 158 C186 166 196 190 176 194 C164 196 160 182 170 180",
];

// Thin inner lines that echo the main vines, for an engraved look.
const echoes = [
  "M84 168 C44 160 30 118 46 86 C62 56 98 40 134 44",
  "M90 172 C116 180 146 172 160 154",
];

// Leaves: [x, y, rotation in degrees]
const leaves: [number, number, number][] = [
  [28, 102, -70],
  [62, 46, -30],
  [118, 30, 10],
  [112, 184, 175],
  [148, 172, -150],
  [12, 140, 100],
  [86, 22, -60],
];

// Beads: [x, y, radius]
const beads: [number, number, number][] = [
  [50, 53, 3],
  [26, 140, 3],
  [143, 57, 3.5],
  [152, 141, 3.5],
  [121, 26, 3],
  [170, 180, 3],
  [180, 100, 2.5],
  [6, 100, 2],
  [96, 194, 2],
];

// Accepts normal SVG settings (x, y, width, height...) so it can be placed inside a bigger drawing.
export function Filigree(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" {...props}>
      <defs>
        {/* Polished gold: light and dark bands so the swirls look like metal, not flat paint */}
        <linearGradient id="filigree-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="35%" stopColor="#d4a017" />
          <stop offset="60%" stopColor="#8a6508" />
          <stop offset="100%" stopColor="#f5d76e" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#filigree-gold)" strokeLinecap="round">
        {vines.map((d) => (
          <path key={d} d={d} strokeWidth={3} />
        ))}
        {echoes.map((d) => (
          <path key={d} d={d} strokeWidth={1} opacity={0.6} />
        ))}
      </g>
      <g fill="url(#filigree-gold)">
        {leaves.map(([x, y, angle]) => (
          <path
            key={`${x}-${y}`}
            d="M0 0 C4 -6 12 -6 16 0 C12 6 4 6 0 0 Z"
            transform={`translate(${x} ${y}) rotate(${angle})`}
          />
        ))}
        {beads.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}
