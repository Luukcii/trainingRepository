// Lays out a rulebook: contents list, numbered sections, and an A–Z glossary at the end.
// Server-rendered, so the text arrives as plain HTML (fast on phones); only the tappable words use JavaScript.
import type { Block, Rulebook } from "@/content/war/types";
import { glossary } from "@/content/war/glossary";
import { ExplainProvider } from "./ExplainProvider";
import { RichText } from "./RichText";
import { Term } from "./Term";
import { WarNav } from "./WarNav";

export function RulebookView({ book, current }: { book: Rulebook; current: "guide" | "full" }) {
  const contents = (
    <ol className="space-y-1 text-sm">
      {book.sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="block rounded px-2 py-1 text-muted hover:bg-line hover:text-foreground">
            {s.title}
          </a>
        </li>
      ))}
      <li>
        <a href="#glossary" className="block rounded px-2 py-1 text-muted hover:bg-line hover:text-foreground">
          Glossary A–Z
        </a>
      </li>
    </ol>
  );

  return (
    <ExplainProvider>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <WarNav current={current} />
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{book.title}</h1>
          <p className="mt-2 text-muted">{book.subtitle}</p>
          <p className="mt-1 text-xs text-muted">Rules as of {book.asOf}</p>
        </header>

        <details className="mb-8 rounded-lg border border-line lg:hidden">
          <summary className="cursor-pointer px-4 py-3 font-medium">Contents</summary>
          <nav aria-label="Contents" className="px-2 pb-3">{contents}</nav>
        </details>

        <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10">
          <nav aria-label="Contents" className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">{contents}</div>
          </nav>

          <article className="min-w-0">
            {book.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20 border-b border-line py-8 first:pt-0 last:border-b-0">
                <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
                {section.lead && <p className="mt-2 text-lg">{<RichText text={section.lead} />}</p>}
                {section.source && <p className="mt-1 text-xs text-muted">Source: {section.source}</p>}
                <div className="mt-4 space-y-4 leading-relaxed">
                  {section.blocks.map((block, i) => (
                    <BlockView key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}

            <section id="glossary" className="scroll-mt-20 py-8">
              <h2 className="text-2xl font-semibold tracking-tight">Glossary A–Z</h2>
              <p className="mt-2 text-muted">Tap a word for its full explanation.</p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
                {[...glossary]
                  .sort((a, b) => a.term.localeCompare(b.term))
                  .map((entry) => (
                    <li key={entry.id}>
                      <Term id={entry.id}>{entry.term}</Term>
                    </li>
                  ))}
              </ul>
            </section>
          </article>
        </div>
      </div>
    </ExplainProvider>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag className={`space-y-1 pl-6 ${block.ordered ? "list-decimal" : "list-disc"}`}>
          {block.items.map((item, i) => (
            <li key={i}>
              <RichText text={item} />
            </li>
          ))}
        </ListTag>
      );
    }
    case "table":
      // Wide tables scroll sideways inside their own box, so the page never does on a phone.
      return (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="border-b-2 border-line px-2 py-2 text-left align-bottom font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="even:bg-line/30">
                  {row.map((cell, c) => (
                    <td key={c} className={`border-b border-line px-2 py-2 align-top ${c === 0 ? "font-medium" : ""}`}>
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.note && <p className="mt-2 text-xs text-muted">{block.note}</p>}
        </div>
      );
    case "callout": {
      const styles = {
        tip: "border-sky-500/40 bg-sky-500/10",
        warn: "border-red-500/40 bg-red-500/10",
        missing: "border-amber-500/40 bg-amber-500/10",
      }[block.tone];
      const title = block.title ?? (block.tone === "missing" ? "Not in this book yet" : undefined);
      return (
        <div className={`rounded-lg border px-4 py-3 ${styles}`}>
          {title && <p className="font-semibold">{title}</p>}
          <p>
            <RichText text={block.text} />
          </p>
        </div>
      );
    }
  }
}
