// A member's emblem: one of the pixel drawings in player-card.ts, painted in their chosen color.
import { emblemColors, emblems, type ColorKey, type EmblemKey } from "@/content/player-card";

const fixed: Record<string, string> = { d: "#1f2328", w: "#f5f5f5", s: "#c0c6cc" };

type EmblemProps = { emblem: EmblemKey; color: ColorKey } & React.SVGProps<SVGSVGElement>;

export function Emblem({ emblem, color, ...svgProps }: EmblemProps) {
  const sprite = emblems[emblem].sprite;
  const pixels = sprite.flatMap((row, y) =>
    [...row].map((cell, x) =>
      cell === "." ? null : (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={cell === "x" ? emblemColors[color].hex : fixed[cell]} />
      ),
    ),
  );

  return (
    <svg viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true" {...svgProps}>
      {pixels}
    </svg>
  );
}
