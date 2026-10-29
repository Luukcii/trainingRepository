"use client"; // needs the browser: shows "Uploading…" and the result

import { useActionState } from "react";
import { removePictureAction, uploadPictureAction } from "@/app/profile/actions";
import type { PictureKind } from "@/lib/uploads";

const hints: Record<PictureKind, string> = {
  emblem: "Square works best. It's cut to 256×256.",
  banner: "Wide works best. It's cut to 1024×256.",
};

export function PictureUpload({ kind, hasPicture }: { kind: PictureKind; hasPicture: boolean }) {
  const [state, upload, pending] = useActionState(uploadPictureAction, null);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line p-4">
      <p className="text-sm capitalize">Your own {kind}</p>
      <form action={upload} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="kind" value={kind} />
        <input
          type="file"
          name="file"
          required
          // A hint for the file picker only. The server checks the real contents.
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="max-w-full text-sm file:mr-2 file:rounded-md file:border file:border-line file:bg-transparent file:px-3 file:py-1.5 file:text-sm"
        />
        <button type="submit" disabled={pending} className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background disabled:opacity-50">
          {pending ? "Uploading…" : "Upload"}
        </button>
      </form>
      {hasPicture && (
        <form action={removePictureAction}>
          <input type="hidden" name="kind" value={kind} />
          <button type="submit" className="text-sm text-muted underline hover:text-foreground">
            Remove picture (go back to the preset)
          </button>
        </form>
      )}
      <p className="text-xs text-muted">{hints[kind]} JPG, PNG, WebP or GIF, up to 3 MB.</p>
      {state && "ok" in state && <p className="text-sm text-green-600">Uploaded.</p>}
      {state && "error" in state && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
    </div>
  );
}
