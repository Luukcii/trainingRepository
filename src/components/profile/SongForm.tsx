"use client"; // needs the browser: shows "Saving…" and the result

import { useActionState } from "react";
import { removeSongAction, saveSongAction } from "@/app/profile/actions";

export function SongForm({ hasSong }: { hasSong: boolean }) {
  const [state, save, pending] = useActionState(saveSongAction, null);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line p-4">
      <p className="text-sm">Profile song</p>
      <form action={save} className="flex flex-wrap gap-2">
        <input
          name="link"
          required
          maxLength={300}
          placeholder="Paste a YouTube link"
          aria-label="YouTube link"
          className="min-w-0 flex-1 rounded-md border border-line bg-transparent px-3 py-1.5 text-sm"
        />
        <button type="submit" disabled={pending} className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background disabled:opacity-50">
          {pending ? "Saving…" : "Save song"}
        </button>
      </form>
      {hasSong && (
        <form action={removeSongAction}>
          <button type="submit" className="text-sm text-muted underline hover:text-foreground">
            Remove song
          </button>
        </form>
      )}
      <p className="text-xs text-muted">Plays on your profile. On YouTube: Share → Copy, then paste here.</p>
      {state && "ok" in state && <p className="text-sm text-green-600">Saved. Open your profile to hear it.</p>}
      {state && "error" in state && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
    </div>
  );
}
