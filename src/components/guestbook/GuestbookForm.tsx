"use client"; // needs the browser: shows errors and clears the box after posting

import { useActionState } from "react";
import { postEntryAction } from "@/app/guestbook/actions";

export function GuestbookForm({ name }: { name: string }) {
  const [state, post, pending] = useActionState(postEntryAction, null);

  return (
    <form action={post} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Leave a message as {name}
        <textarea name="body" required maxLength={500} rows={3} className="rounded-md border border-line bg-transparent px-3 py-2" />
      </label>
      {state && "error" in state && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
      <button type="submit" disabled={pending} className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50">
        {pending ? "Posting…" : "Sign the guestbook"}
      </button>
    </form>
  );
}
