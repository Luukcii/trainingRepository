// A member's emblem: their uploaded picture, or one of the pixel drawings in player-card.ts in their chosen color.
import { emblemColors, emblems, type ColorKey, type EmblemKey } from "@/content/player-card";

const fixed: Record<string, string> = { d: "#1f2328", w: "#f5f5f5", s: "#c0c6cc" };

type EmblemProps = { emblem: EmblemKey; color: ColorKey; image?: string; className?: string };

export function Emblem({ emblem, color, image, className }: EmblemProps) {
  if (image) {
    // A plain <img>: the picture is already a small WebP our server made, so there's nothing to optimize.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className={`rounded-sm object-cover ${className ?? ""}`} />;
  }

  const sprite = emblems[emblem].sprite;
  const pixels = sprite.flatMap((row, y) =>
    [...row].map((cell, x) =>
      cell === "." ? null : (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={cell === "x" ? emblemColors[color].hex : fixed[cell]} />
      ),
    ),
  );

  return (
    <svg viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {pixels}
    </svg>
  );
}
