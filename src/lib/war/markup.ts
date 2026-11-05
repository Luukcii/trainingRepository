// Splits rule text into plain words and glossary links. "[[envoy|Envoys]]" becomes
// { term: "envoy", label: "Envoys" }. Used on the server (rulebooks) and in the browser (pop-ups).

export type Piece = { text: string } | { term: string; label: string };

const LINK = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

export function parseMarkup(source: string): Piece[] {
  const pieces: Piece[] = [];
  let last = 0;
  for (const match of source.matchAll(LINK)) {
    const at = match.index ?? 0;
    if (at > last) pieces.push({ text: source.slice(last, at) });
    pieces.push({ term: match[1], label: match[2] ?? "" });
    last = at + match[0].length;
  }
  if (last < source.length) pieces.push({ text: source.slice(last) });
  return pieces;
}

// Plain text with the link brackets removed (for Discord messages and search).
export function stripMarkup(source: string, termName: (id: string) => string): string {
  return parseMarkup(source)
    .map((p) => ("text" in p ? p.text : p.label || termName(p.term)))
    .join("");
}
