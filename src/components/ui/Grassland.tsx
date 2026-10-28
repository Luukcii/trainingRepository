// A meadow the castle stands in: a real grass photo, tinted greener, fading out at the edges,
// with a fringe of blades along the top edge so the walls look planted in it.
const bladeColors = ["#3f6b23", "#4f8a2b", "#5e9a33", "#36591f"];

type GrasslandProps = { width: number; top: number; depth: number };

export function Grassland({ width, top, depth }: GrasslandProps) {
  return (
    <g>
      <defs>
        <linearGradient id="grass-fade-down" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <linearGradient id="grass-fade-sides" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.08" stopColor="#fff" />
          <stop offset="0.92" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="grass-down" maskContentUnits="userSpaceOnUse">
          <rect x={0} y={top - 4} width={width} height={depth + 4} fill="url(#grass-fade-down)" />
        </mask>
        <mask id="grass-sides" maskContentUnits="userSpaceOnUse">
          <rect x={0} y={top - 10} width={width} height={depth + 10} fill="url(#grass-fade-sides)" />
        </mask>
      </defs>
      <g mask="url(#grass-sides)">
        <g mask="url(#grass-down)">
          <rect x={0} y={top - 4} width={width} height={depth + 4} fill="url(#grass)" />
          <rect x={0} y={top - 4} width={width} height={depth + 4} fill="#4f8a2b" opacity={0.35} />
        </g>
      </g>
    </g>
  );
}

// Blades drawn last, in front of the wall bases. Heights and colors vary by position, not randomly,
// so the page looks identical on every load.
export function GrassBlades({ width, top }: { width: number; top: number }) {
  const blades = [];
  for (let x = width * 0.06; x < width * 0.94; x += 2.5) {
    const n = Math.round(x * 10);
    const h = 2.5 + ((n * 37) % 23) / 6;
    const lean = (((n * 13) % 7) - 3) * 0.4;
    blades.push(
      <path key={n} d={`M${x - 1} ${top + 1} L${x + lean} ${top - h} L${x + 1} ${top + 1} Z`} fill={bladeColors[n % bladeColors.length]} />,
    );
  }
  return <g>{blades}</g>;
}
