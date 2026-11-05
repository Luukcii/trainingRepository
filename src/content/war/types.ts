// The shapes every faction-war content file uses. Rule text can link glossary terms with
// [[term-id]] or [[term-id|words to show]]; the page turns those into tap-to-explain buttons.

export type GlossaryEntry = {
  id: string;
  term: string;
  short: string; // one or two sentences, shown first in the pop-up
  more?: string[]; // extra paragraphs, may link other terms
  missing?: string; // what the Hardset Register still has to settle
};

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; head: string[]; rows: string[][]; note?: string }
  | { type: "callout"; tone: "tip" | "warn" | "missing"; title?: string; text: string };

export type RuleSection = {
  id: string; // also the #anchor in the URL
  title: string;
  lead?: string; // the section's point, in one sentence
  blocks: Block[];
  source?: string; // where the rule came from (technical rulebook only)
};

export type Rulebook = {
  title: string;
  subtitle: string;
  asOf: string;
  sections: RuleSection[];
};
