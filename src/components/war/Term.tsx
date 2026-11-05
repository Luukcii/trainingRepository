"use client";
// One tappable word. A real <button>, so it works with a finger, a mouse, or the keyboard (Tab + Enter).
import type { ReactNode } from "react";
import { useExplain } from "./ExplainProvider";

export function Term({ id, children }: { id: string; children: ReactNode }) {
  const { openTerm } = useExplain();
  return (
    <button
      type="button"
      onClick={() => openTerm(id)}
      className="inline cursor-help rounded-sm p-0 text-left font-medium underline decoration-dotted decoration-2 underline-offset-4 hover:decoration-solid focus-visible:outline-2"
    >
      {children}
    </button>
  );
}
