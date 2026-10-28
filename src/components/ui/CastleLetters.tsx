// Turns the wall cells into castle masonry: stone blocks, battlements along wall tops,
// arrow slits in towers, light and shadow on the exposed faces, and a dark outline.
import { C, TOP, type Cell } from "./castle-layout";

const INK = "#2a2622";

export function CastleLetters({ cells }: { cells: Cell[] }) {
  const walls = cells.filter((c) => c.kind === "#");
  const solid = new Set(walls.map((c) => `${c.col},${c.row}`));
  const has = (col: number, row: number) => solid.has(`${col},${row}`);
  const openTop = (col: number, row: number) => has(col, row) && !has(col, row - 1);

  const blocks = [];
  const details = [];
  let outline = "";

  for (const { col, row } of walls) {
    const x = col * C;
    const y = TOP + row * C;
    const k = `${col}-${row}`;
    const open = { top: !has(col, row - 1), right: !has(col + 1, row), bottom: !has(col, row + 1), left: !has(col - 1, row) };

    blocks.push(<rect key={k} x={x} y={y} width={C} height={C} fill="url(#castle-stone)" />);

    // Light falls from the top-left: shadow on exposed right/bottom faces, highlight on top/left.
    if (open.right) details.push(<rect key={`sr${k}`} x={x + C - 1.5} y={y} width={1.5} height={C} fill="#000" opacity={0.3} />);
    if (open.bottom) details.push(<rect key={`sb${k}`} x={x} y={y + C - 1.5} width={C} height={1.5} fill="#000" opacity={0.3} />);
    if (open.left) details.push(<rect key={`hl${k}`} x={x} y={y} width={1.2} height={C} fill="#fff" opacity={0.18} />);

    // Arrow slit down the middle of a two-block tower, every third row.
    const towerLeftEdge = open.left && has(col + 1, row) && !has(col + 2, row);
    const walledAboveBelow = has(col, row - 1) && has(col, row + 1) && has(col + 1, row - 1) && has(col + 1, row + 1);
    if (towerLeftEdge && walledAboveBelow && row % 3 === 1) {
      details.push(
        <g key={`slit${k}`} fill="#1a1715">
          <rect x={x + C - 0.9} y={y + 1.5} width={1.8} height={C - 3} />
          <rect x={x + C - 2.5} y={y + C / 2 - 0.8} width={5} height={1.6} />
        </g>,
      );
    }

    // Battlements on wall tops: a run of at least two open-topped blocks gets evenly spaced teeth,
    // flush with both corners. Single stair-steps stay smooth, which keeps diagonals readable.
    if (openTop(col, row) && !openTop(col - 1, row)) {
      let length = 1;
      while (openTop(col + length, row)) length++;
      if (length >= 2) {
        const teeth = length + 1;
        const w = C * 0.5;
        const gap = (length * C - teeth * w) / (teeth - 1);
        for (let t = 0; t < teeth; t++) {
          details.push(
            <rect
              key={`m${t}-${k}`}
              x={x + t * (w + gap)}
              y={y - C * 0.4}
              width={w}
              height={C * 0.4}
              fill="url(#castle-stone)"
              stroke={INK}
              strokeWidth={0.7}
            />,
          );
        }
      }
    }

    // A few patches of moss along overhangs and where walls meet the ground.
    if (open.bottom && (col * 7 + row * 13) % 4 === 0) {
      details.push(<ellipse key={`moss${k}`} cx={x + C * 0.35} cy={y + C - 1.2} rx={C * 0.25} ry={1.3} fill="#4a6b2a" />);
    }

    if (open.top) outline += `M${x} ${y}h${C}`;
    if (open.right) outline += `M${x + C} ${y}v${C}`;
    if (open.bottom) outline += `M${x} ${y + C}h${C}`;
    if (open.left) outline += `M${x} ${y}v${C}`;
  }

  return (
    <g>
      {blocks}
      {details}
      <path d={outline} stroke={INK} strokeWidth={1} fill="none" strokeLinecap="square" />
    </g>
  );
}
