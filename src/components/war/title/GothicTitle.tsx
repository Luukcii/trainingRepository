import { broadPen } from "./pen";
import { glyphs, KERNING, WORD_SPACE, type Glyph } from "./glyphs";
import { Filigree } from "./Filigree";

const TEXT = "Faction War";
const NIB = 6.5; // pen tip width: smaller = thinner, finer letters
const FINE_NIB = 2.8; // the narrow pen for swashes
const TRACKING = -2; // space between letters: negative pulls them closer, like tightly woven textura

// Place each letter after the previous one, left to right.
function layout(text: string) {
  const placed: { glyph: Glyph; x: number }[] = [];
  let x = 0;
  let previous = "";
  for (const ch of text) {
    if (ch === " ") {
      x += WORD_SPACE;
      previous = "";
      continue;
    }
    const glyph = glyphs[ch];
    if (!glyph) throw new Error(`No glyph drawn for "${ch}" yet`);
    x += KERNING[previous + ch] ?? 0; // this pair of letters may need its own nudge
    placed.push({ glyph, x });
    x += glyph.advance * (glyph.scale ?? 1) + TRACKING;
    previous = ch;
  }
  return { placed, width: x - TRACKING };
}

const diamond = (x: number, y: number, s: number) => `M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`;

// The page title, hand-lettered: silver pen strokes with gold edges, gold hairlines and swirls.
// Built on the server once; the browser just receives a finished drawing (no JavaScript).
export function GothicTitle({ className }: { className?: string }) {
  const { placed, width } = layout(TEXT);
  const left = -24; // room for the swirls left of the F
  const top = -132; // room for the swirls above
  const bottom = 30; // room for swirls and flourishes below the baseline

  return (
    <svg viewBox={`${left} ${top} ${width - left + 10} ${bottom - top}`} className={className} aria-hidden="true">
      <defs>
        {/* Chrome: bright and dark bands across the letters, like light on polished silver */}
        <linearGradient id="title-chrome" gradientUnits="userSpaceOnUse" x1="0" y1="-80" x2="0" y2="4">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#d6d3d1" />
          <stop offset="50%" stopColor="#78716c" />
          <stop offset="65%" stopColor="#e7e5e4" />
          <stop offset="100%" stopColor="#a8a29e" />
        </linearGradient>
        <linearGradient id="title-gold" gradientUnits="userSpaceOnUse" x1="0" y1="-90" x2="0" y2="10">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="45%" stopColor="#d4a017" />
          <stop offset="70%" stopColor="#8a6508" />
          <stop offset="100%" stopColor="#f5d76e" />
        </linearGradient>
        {/* Gold edge: grow a copy of the letters slightly, paint it gold, lay the silver on top */}
        <filter id="title-edge">
          <feMorphology in="SourceAlpha" operator="dilate" radius="0.45" result="grown" />
          <feFlood floodColor="#d4a017" />
          <feComposite in2="grown" operator="in" result="edge" />
          <feMerge>
            <feMergeNode in="edge" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Gold vines framing the first letter, stretched into an upright oval to fit the F.
          SVG paints in order, like layers of paper: the vines come first, so the letters drawn
          after them cover them. That's how the "a" sits in front of the vines' right edge. */}
      <Filigree x={-18.8} y={-127.4} width={112} height={155} preserveAspectRatio="none" />

      {placed.map(({ glyph, x }, i) => {
        const s = glyph.scale ?? 1;
        return (
          <g key={i} transform={`translate(${x} 0)`}>
            <path
              d={broadPen(glyph.pen, NIB, -45, s) + broadPen(glyph.fine ?? [], FINE_NIB, -45, s)}
              fill="url(#title-chrome)"
              stroke="url(#title-chrome)"
              strokeWidth={0.5}
              strokeLinejoin="round"
              filter="url(#title-edge)"
            />
            {/* Hairlines and gems are enlarged with the letter; the hairline width is divided back down */}
            <g transform={`scale(${s})`}>
              {glyph.hair && (
                <g fill="none" stroke="url(#title-gold)" strokeWidth={1 / s} strokeLinecap="round">
                  {glyph.hair.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
              )}
              {glyph.gems?.map(([gx, gy, size]) => (
                <path key={`${gx}-${gy}`} d={diamond(gx, gy, size)} fill="url(#title-gold)" />
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
