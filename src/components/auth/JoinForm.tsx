"use client"; // needs the browser: shows errors without reloading the page

import { useActionState } from "react";
import { joinAction } from "@/app/join/[token]/actions";

const inputClass = "rounded-md border border-line bg-transparent px-3 py-2";

export function JoinForm({ token }: { token: string }) {
  const [state, join, pending] = useActionState(joinAction, null);

  return (
    <form action={join} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input name="name" required maxLength={60} autoComplete="name" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password (12+ characters)
        <input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className={inputClass} />
      </label>
      {state?.error && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-md bg-foreground px-4 py-2 font-medium text-background disabled:opacity-50">
        {pending ? "Creating…" : "Create account"}
      </button>
      <p className="text-xs text-muted">Max can see what you do on this site (posts, reviews, friends).</p>
    </form>
  );
}
