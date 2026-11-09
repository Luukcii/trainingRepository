// The whole public rulebook as one block of plain text: what God reads before answering /war ask.
// Only public content goes in (the same rulebooks and glossary anyone can read on /war/rules), never the
// live war numbers, so nothing he says can leak a kingdom's secrets.
// It must come out exactly the same every time: the AI service caches it, and one changed letter means
// paying full price to read it again.
import { glossary, findTerm } from "@/content/war/glossary";
import { techRules } from "@/content/war/tech-rules";
import { factions, territories } from "@/content/war/map";
import type { Block } from "@/content/war/types";
import { stripMarkup } from "./markup";

const plain = (text: string) => stripMarkup(text, (id) => findTerm(id)?.term ?? id);

function blockText(block: Block): string {
  switch (block.type) {
    case "p":
      return plain(block.text);
    case "list":
      return block.items.map((item, i) => `${block.ordered ? `${i + 1}.` : "-"} ${plain(item)}`).join("\n");
    case "table":
      return [block.head.map(plain).join(" | "), ...block.rows.map((row) => row.map(plain).join(" | ")), block.note ? plain(block.note) : ""]
        .filter(Boolean)
        .join("\n");
    case "callout":
      return `${block.tone === "missing" ? "NOT SETTLED YET" : block.tone === "warn" ? "WARNING" : "TIP"}${block.title ? `: ${plain(block.title)}` : ""}: ${plain(block.text)}`;
  }
}

function build() {
  const book = techRules.sections.map((s) =>
    [`## ${s.title}`, s.lead ? plain(s.lead) : "", ...s.blocks.map(blockText)].filter(Boolean).join("\n\n"),
  );
  const terms = glossary.map((g) =>
    [`- ${g.term}: ${plain(g.short)}`, ...(g.more ?? []).map((m) => `  ${plain(m)}`), g.missing ? `  NOT SETTLED YET: ${plain(g.missing)}` : ""]
      .filter(Boolean)
      .join("\n"),
  );
  const places = territories.map(
    (t) => `- ${t.name}: ${t.home ? `${factions[t.home].name}${t.number ? ` ${t.number}` : " capital"}` : "neutral"}${t.note && t.note.startsWith("Neutral · ") ? ` (${t.note.slice(10)})` : ""}`,
  );
  return [
    `# ${techRules.title} (as of ${techRules.asOf})`,
    ...book,
    "# Glossary",
    terms.join("\n"),
    "# Territories at the start of the war",
    places.join("\n"),
  ].join("\n\n");
}

let cached: string | null = null;
export function rulebookText() {
  return (cached ??= build());
}
