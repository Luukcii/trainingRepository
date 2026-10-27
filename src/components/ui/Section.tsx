// A page section with a consistent width, spacing, and heading. The id makes it a menu target.
import type { ReactNode } from "react";

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-line py-20 last:border-b-0">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
        {children}
      </div>
    </section>
  );
}
