"use client"; // needs the browser: it reads the link's ?name=, tracks typing and reacts to submit

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const MIN = 12; // same as the server's minimum (auth-options.ts); the server checks again anyway

// Step 1 logs in with God's password. Step 2, only if they typed a new one, swaps it in and logs out
// every other device. Both go through /api/auth, so the 5-tries-a-minute limit guards them.
export function WarJoinForm() {
  const router = useRouter();
  const nameBox = useRef<HTMLInputElement>(null);
  // God's link ends in ?name=<your Discord name>: fill it in once the page is open. (Done after loading,
  // so the form itself can be part of the ready-made page and show up instantly.)
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("name") ?? "";
    if (nameBox.current && !nameBox.current.value) nameBox.current.value = name.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 32);
  }, []);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username")).trim().toLowerCase();
    const current = String(form.get("current")).trim();
    const fresh = String(form.get("fresh"));
    if (fresh && fresh.length < MIN) return setError(`Your new password needs ${MIN} characters or more.`);
    if (fresh !== String(form.get("confirm"))) return setError("The two new passwords don't match.");

    setPending(true);
    const login = await authClient.signIn.username({ username, password: current });
    if (login.error) {
      setPending(false);
      // Same message for every failure: never hint whether the Discord name has an account.
      return setError(login.error.status === 429 ? "Too many attempts. Wait a minute." : "Invalid Discord name or password.");
    }
    if (fresh) {
      const change = await authClient.changePassword({ currentPassword: current, newPassword: fresh, revokeOtherSessions: true });
      if (change.error) {
        setPending(false);
        return setError("You're logged in, but the new password wasn't saved. Your password is still God's. Try again.");
      }
    }
    router.push("/war");
    router.refresh();
  }

  const input = "rounded-md border border-line bg-transparent px-3 py-2";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Discord username
        <input ref={nameBox} name="username" required autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={32} className={input} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password God gave you
        <input name="current" type="password" required autoComplete="current-password" className={input} />
      </label>
      <fieldset className="flex flex-col gap-3 rounded-md border border-line p-3">
        <legend className="px-1 text-sm">Choose your own password (optional)</legend>
        <p className="text-xs text-muted">Leave empty to keep God&apos;s. {MIN} characters or more. Logs out your other devices.</p>
        <label className="flex flex-col gap-1 text-sm">
          New password
          <input name="fresh" type="password" autoComplete="new-password" maxLength={128} className={input} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          New password again
          <input name="confirm" type="password" autoComplete="new-password" maxLength={128} className={input} />
        </label>
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={pending} className="rounded-md bg-foreground px-4 py-2 font-medium text-background disabled:opacity-50">
        {pending ? "Entering…" : "Enter the war"}
      </button>
    </form>
  );
}
