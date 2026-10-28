// A small white banner with a red crusader cross, flying from a pole. (x, y) is the foot of the pole.
import { C } from "./castle-layout";

export function CastleFlag({ x, y }: { x: number; y: number }) {
  const top = y - C * 2.3;
  const w = C * 1.8;
  const h = C * 1.1;
  // The cloth ripples: curved top and bottom edges instead of straight lines.
  const cloth = `M${x} ${top} C${x + w / 3} ${top - 3} ${x + (2 * w) / 3} ${top + 3} ${x + w} ${top} L${x + w} ${top + h} C${x + (2 * w) / 3} ${top + h + 3} ${x + w / 3} ${top + h - 3} ${x} ${top + h} Z`;
  const clipId = `flag-${x}`;

  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={top - 1.5} stroke="#5b4636" strokeWidth={1.2} />
      <circle cx={x} cy={top - 1.8} r={1.2} fill="#d4a017" />
      <clipPath id={clipId}>
        <path d={cloth} />
      </clipPath>
      <path d={cloth} fill="#f5f1e6" />
      <g clipPath={`url(#${clipId})`} fill="#b91c1c">
        <rect x={x + w * 0.3} y={top - 4} width={2.6} height={h + 8} />
        <rect x={x} y={top + h / 2 - 1.3} width={w} height={2.6} />
      </g>
      <path d={cloth} fill="none" stroke="#2a2622" strokeWidth={0.5} />
    </g>
  );
}
