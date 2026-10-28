// The whole hero picture: castle letters standing in a meadow, banners on the capitals,
// rubble between the walls, and knights on the grass. Decorative only; the real text sits beside it.
import { CastleFlag } from "./CastleFlag";
import { CastleLetters } from "./CastleLetters";
import { CastleRubble } from "./CastleRubble";
import { C, TOP, groundY, layoutCastle } from "./castle-layout";
import { GrassBlades, Grassland } from "./Grassland";
import { PixelKnight } from "./PixelKnight";

const GRASS_DEPTH = C * 4.5;

// Knights on the meadow. `x` is a fraction of the scene's width; `depth` 0 = far back, 1 = front.
// Farther knights stand higher up the grass and are drawn smaller.
const knights = [
  { color: "#1c1c1c", x: 0.03, depth: 0.55, flip: false },
  { color: "#2563eb", x: 0.075, depth: 0.1, flip: false },
  { color: "#16a34a", x: 0.4, depth: 0.85, flip: false },
  { color: "#ea580c", x: 0.47, depth: 0.35, flip: true },
  { color: "#9333ea", x: 0.64, depth: 0.95, flip: true },
  { color: "#0891b2", x: 0.86, depth: 0.15, flip: true },
  { color: "#db2777", x: 0.935, depth: 0.6, flip: true },
];
const SPRITE_W = 12;
const SPRITE_H = 15;

export function CastleScene({ text, className }: { text: string; className?: string }) {
  const { cells, gaps, flags, columns } = layoutCastle(text);
  const width = columns * C;
  const height = groundY + GRASS_DEPTH;

  const rubble = [
    ...cells
      .filter((c) => c.kind === "r")
      .map((c) => <CastleRubble key={`r${c.col}-${c.row}`} x={c.col * C} y={TOP + c.row * C} w={C} h={C * 0.8} seed={c.col + c.row} />),
    ...gaps.map((g) => (
      <CastleRubble key={`g${g.col}`} x={g.col * C - 2} y={groundY - C * 0.7} w={g.width * C + 4} h={C * 0.7} seed={g.col} />
    )),
  ];

  const people = [...knights]
    .sort((a, b) => a.depth - b.depth)
    .map((k) => {
      const scale = 1.6 + k.depth * 1.3; // SVG units per sprite pixel
      const w = SPRITE_W * scale;
      const h = SPRITE_H * scale;
      const x = k.x * width - w / 2;
      const y = groundY + C * 0.3 + k.depth * (GRASS_DEPTH - C * 1.2) - h;
      return (
        <g key={k.color} transform={k.flip ? `translate(${2 * x + w} 0) scale(-1 1)` : undefined}>
          <PixelKnight color={k.color} x={x} y={y} width={w} height={h} />
        </g>
      );
    });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className={className}>
      <defs>
        {/* Real photos, tiled: castle wall for the stone, a meadow for the grass. */}
        <pattern id="castle-stone" patternUnits="userSpaceOnUse" width={80} height={80}>
          <image href="/textures/castle-wall.webp" width={80} height={80} />
        </pattern>
        <pattern id="grass" patternUnits="userSpaceOnUse" width={120} height={120}>
          <image href="/textures/grass.webp" width={120} height={120} />
        </pattern>
      </defs>
      <Grassland width={width} top={groundY} depth={GRASS_DEPTH} />
      <g style={{ filter: "drop-shadow(0 2px 2px rgb(0 0 0 / 0.35))" }}>
        {flags.map((col) => (
          <CastleFlag key={col} x={col * C} y={TOP - C * 0.4} />
        ))}
        <CastleLetters cells={cells} />
        {rubble}
      </g>
      <GrassBlades width={width} top={groundY} />
      {people}
    </svg>
  );
}
