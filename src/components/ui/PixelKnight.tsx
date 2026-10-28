// One 8-bit knight, drawn as a grid of square "pixels". The color prop paints plume, tunic and shield.
const sprite = [
  "....pp......",
  "...ppp....s.",
  "...hhhh...s.",
  "..hhhhhh..s.",
  "..hvvvvh..s.",
  "..hhhhhh..s.",
  "...hhhh..ggg",
  ".aaaaaaaa.k.",
  "bbbaaaaaaak.",
  "bcbaaaaaa...",
  "bbbaaaaaa...",
  ".b.aaaaaa...",
  "...ll..ll...",
  "...ll..ll...",
  "..fff..fff..",
];

// Fixed colors; "color" fills in the letters p, a and b.
const palette: Record<string, string> = {
  h: "#c0c6cc", // helmet
  v: "#1f2328", // visor slit
  s: "#e5e7eb", // sword blade
  g: "#d4a017", // crossguard
  k: "#6b4423", // hilt
  c: "#f5d76e", // shield emblem
  l: "#8a9099", // legs
  f: "#3b3f45", // boots
};

// Any other SVG attribute (x, y, width, height, className…) passes straight through,
// so a knight can stand on its own or inside a bigger drawing.
type PixelKnightProps = { color: string } & React.SVGProps<SVGSVGElement>;

export function PixelKnight({ color, ...svgProps }: PixelKnightProps) {
  const pixels = sprite.flatMap((row, y) =>
    [...row].map((cell, x) => {
      if (cell === ".") return null;
      const fill = "pab".includes(cell) ? color : palette[cell];
      return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
    }),
  );

  return (
    <svg
      viewBox={`0 0 ${sprite[0].length} ${sprite.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      {...svgProps}
    >
      {pixels}
    </svg>
  );
}
