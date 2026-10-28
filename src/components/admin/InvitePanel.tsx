"use client"; // needs the browser: it shows the new link and copies it

import { useActionState } from "react";
import { createInviteAction } from "@/app/admin/actions";

export function InvitePanel() {
  const [state, makeInvite, pending] = useActionState(createInviteAction, null);

  return (
    <section className="rounded-lg border border-line p-5">
      <h2 className="mb-2 font-medium">Invites</h2>
      <p className="mb-4 text-sm text-muted">
        Make a sign-up link for one friend. It works once and expires in 7 days.
      </p>
      <form action={makeInvite}>
        <button type="submit" disabled={pending} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50">
          {pending ? "Making…" : "New invite link"}
        </button>
      </form>
      {state && (
        <div className="mt-4 flex gap-2">
          <input readOnly value={state.link} aria-label="Invite link" className="min-w-0 flex-1 rounded-md border border-line bg-transparent px-3 py-2 text-sm" />
          <button type="button" onClick={() => navigator.clipboard.writeText(state.link)} className="rounded-md border border-line px-3 py-2 text-sm">
            Copy
          </button>
        </div>
      )}
    </section>
  );
}
