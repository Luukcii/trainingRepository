"use client";
// The pop-up window behind every tappable word. Any component inside this provider can open an
// explanation: a glossary term by id, or custom content (the map uses that for territories and stats).
// It's a native <dialog>: Esc closes it, focus stays inside it, and the page underneath never moves.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { findTerm } from "@/content/war/glossary";
import { RichText } from "./RichText";

type Item = { kind: "term"; id: string } | { kind: "custom"; title: string; body: ReactNode };

type Explain = {
  openTerm: (id: string) => void;
  openCustom: (title: string, body: ReactNode) => void;
};

const ExplainContext = createContext<Explain | null>(null);

export function useExplain(): Explain {
  const value = useContext(ExplainContext);
  if (!value) throw new Error("useExplain must be used inside <ExplainProvider>");
  return value;
}

export function ExplainProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Item[]>([]); // a history, so a term inside a pop-up can go Back
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const push = useCallback((item: Item) => {
    setStack((current) => {
      if (current.length === 0) opener.current = document.activeElement as HTMLElement | null;
      return [...current, item];
    });
  }, []);

  const openTerm = useCallback((id: string) => push({ kind: "term", id }), [push]);
  const openCustom = useCallback((title: string, body: ReactNode) => push({ kind: "custom", title, body }), [push]);

  const close = useCallback(() => setStack([]), []);
  const back = useCallback(() => setStack((current) => current.slice(0, -1)), []);

  // Show or hide the real dialog when the stack changes, and hand focus back when it closes.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (stack.length > 0 && !el.open) el.showModal();
    if (stack.length === 0 && el.open) {
      el.close();
      opener.current?.focus();
    }
  }, [stack.length]);

  const item = stack.at(-1);

  return (
    <ExplainContext.Provider value={{ openTerm, openCustom }}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="explain-title"
        onCancel={(event) => {
          event.preventDefault(); // Esc: close through React so the stack stays in step
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close(); // a tap on the dimmed backdrop
        }}
        className="explain-dialog m-0 mt-auto w-full max-w-none rounded-t-2xl border border-line bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50 sm:m-auto sm:max-w-lg sm:rounded-2xl"
      >
        {item && (
          <div className="flex max-h-[75vh] flex-col sm:max-h-[80vh]">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              {stack.length > 1 && (
                <button type="button" onClick={back} className="rounded-md px-2 py-1 text-sm text-muted hover:bg-line hover:text-foreground">
                  ← Back
                </button>
              )}
              <h2 id="explain-title" className="flex-1 text-lg font-semibold">
                {item.kind === "term" ? (findTerm(item.id)?.term ?? item.id) : item.title}
              </h2>
              <button
                type="button"
                onClick={close}
                autoFocus
                aria-label="Close"
                className="flex h-11 w-11 items-center justify-center rounded-full text-2xl leading-none text-muted hover:bg-line hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4 text-[15px] leading-relaxed">
              {item.kind === "term" ? <TermBody id={item.id} /> : item.body}
            </div>
          </div>
        )}
      </dialog>
    </ExplainContext.Provider>
  );
}

function TermBody({ id }: { id: string }) {
  const entry = findTerm(id);
  if (!entry) return <p className="text-muted">No definition yet.</p>;
  return (
    <div className="space-y-3">
      <p className="text-base">
        <RichText text={entry.short} />
      </p>
      {entry.more?.map((paragraph, i) => (
        <p key={i}>
          <RichText text={paragraph} />
        </p>
      ))}
      {entry.missing && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          <span className="font-medium">Not settled in this book yet:</span> {entry.missing}
        </p>
      )}
    </div>
  );
}
