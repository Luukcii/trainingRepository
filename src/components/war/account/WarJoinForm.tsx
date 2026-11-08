"use client"; // shows the server's answer (an error) without reloading the page

import { useActionState } from "react";
import { warJoinAction, type WarJoinState } from "@/app/war/join/[token]/actions";

export function WarJoinForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<WarJoinState, FormData>(warJoinAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <label className="flex flex-col gap-1 text-sm">
        Password (12 characters or more)
        <input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className="rounded-md border border-line bg-transparent px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Same password again
        <input name="confirm" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className="rounded-md border border-line bg-transparent px-3 py-2" />
      </label>
      {state?.error && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-md bg-foreground px-4 py-2 font-medium text-background disabled:opacity-50">
        {pending ? "Making your account…" : "Make my account"}
      </button>
    </form>
  );
}
