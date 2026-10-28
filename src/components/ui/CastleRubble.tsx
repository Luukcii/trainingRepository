// A heap of broken stones inside a box, resting on the box's bottom edge. `seed` picks the variation.
const stones = [
  [[0, 1], [0.08, 0.55], [0.35, 0.45], [0.45, 1]],
  [[0.35, 1], [0.42, 0.3], [0.7, 0.2], [0.82, 0.6], [0.78, 1]],
  [[0.72, 1], [0.78, 0.62], [1, 0.7], [1, 1]],
  [[0.22, 0.55], [0.3, 0.22], [0.52, 0.2], [0.5, 0.5]],
];

type CastleRubbleProps = { x: number; y: number; w: number; h: number; seed: number };

export function CastleRubble({ x, y, w, h, seed }: CastleRubbleProps) {
  const flip = seed % 2 === 1;
  const toPoints = (shape: number[][]) =>
    shape.map(([px, py]) => `${x + (flip ? 1 - px : px) * w},${y + py * h}`).join(" ");

  return (
    <g>
      {stones.slice(0, seed % 3 === 0 ? 4 : 3).map((shape, i) => (
        <polygon
          key={i}
          points={toPoints(shape)}
          fill="url(#castle-stone)"
          stroke="#2a2622"
          strokeWidth={0.8}
          strokeLinejoin="round"
        />
      ))}
      {seed % 3 !== 1 && (
        <ellipse cx={x + (flip ? 0.4 : 0.6) * w} cy={y + 0.24 * h} rx={0.12 * w} ry={0.06 * h + 0.6} fill="#4a6b2a" />
      )}
    </g>
  );
}
