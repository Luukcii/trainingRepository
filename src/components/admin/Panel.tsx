// A control-surface slot on the admin dashboard. Each future tool (edit projects, read messages…) lives in one.
import type { ReactNode } from "react";

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line p-5">
      <h2 className="mb-2 font-medium">{title}</h2>
      <div className="text-sm text-muted">{children}</div>
    </section>
  );
}
