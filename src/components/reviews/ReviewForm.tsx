"use client"; // needs the browser: the slider and buttons change the number as you move them

import { useActionState, useState } from "react";
import { saveReviewAction } from "@/app/projects/[slug]/actions";
import { approvalColor } from "./approval-color";

const STEP = 5; // how far the − / + buttons move

export function ReviewForm({ slug, initial }: { slug: string; initial?: { approval: number; comment: string } }) {
  const [approval, setApproval] = useState(initial?.approval ?? 50);
  const [state, save, pending] = useActionState(saveReviewAction, null);
  const nudge = (by: number) => setApproval((v) => Math.min(100, Math.max(0, v + by)));

  return (
    <form action={save} className="flex flex-col gap-4 rounded-lg border border-line p-5">
      <input type="hidden" name="slug" value={slug} />
      <div className="flex items-center justify-between">
        <span className="text-sm">{initial ? "Your review" : "Leave a review"}</span>
        <output htmlFor="approval" className="text-2xl font-semibold tabular-nums" style={{ color: approvalColor(approval) }}>
          {approval}%
        </output>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => nudge(-STEP)} aria-label={`Lower by ${STEP}%`} className="h-9 w-9 rounded-md border border-line text-lg">
          −
        </button>
        <input
          id="approval"
          name="approval"
          type="range"
          min={0}
          max={100}
          step={1}
          value={approval}
          onChange={(e) => setApproval(Number(e.target.value))}
          aria-label="Approval percentage"
          className="flex-1"
          style={{ accentColor: approvalColor(approval) }}
        />
        <button type="button" onClick={() => nudge(STEP)} aria-label={`Raise by ${STEP}%`} className="h-9 w-9 rounded-md border border-line text-lg">
          +
        </button>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Comment (optional)
        <textarea name="comment" defaultValue={initial?.comment} maxLength={1000} rows={3} className="rounded-md border border-line bg-transparent px-3 py-2" />
      </label>

      {state && "error" in state && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-muted">Saved.</p>}
      <button type="submit" disabled={pending} className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50">
        {pending ? "Saving…" : initial ? "Update review" : "Post review"}
      </button>
    </form>
  );
}
