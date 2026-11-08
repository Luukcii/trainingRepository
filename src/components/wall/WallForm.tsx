"use client"; // needs the browser: shows "Posting…", clears the box after a post

import { useActionState, useEffect, useRef } from "react";
import { commentAction, postOnWallAction } from "@/app/members/[userId]/wall-actions";

// One form for both: a new wall post (wallOwnerId) or a comment under a post (postId).
type WallFormProps = { kind: "post"; wallOwnerId: string; placeholder: string } | { kind: "comment"; postId: string; placeholder: string };

export function WallForm(props: WallFormProps) {
  const [state, submit, pending] = useActionState(props.kind === "post" ? postOnWallAction : commentAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const isPost = props.kind === "post";

  useEffect(() => {
    if (state && "ok" in state) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={submit} className="flex flex-col gap-2">
      {props.kind === "post" ? (
        <input type="hidden" name="wallOwnerId" value={props.wallOwnerId} />
      ) : (
        <input type="hidden" name="postId" value={props.postId} />
      )}
      <div className="flex gap-2">
        <textarea
          name="body"
          required
          maxLength={isPost ? 500 : 300}
          rows={isPost ? 2 : 1}
          placeholder={props.placeholder}
          aria-label={props.placeholder}
          className="flex-1 resize-none rounded-md border border-line bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className={`self-end rounded-md px-3 py-2 text-sm disabled:opacity-50 ${isPost ? "bg-foreground font-medium text-background" : "border border-line"}`}
        >
          {pending ? "…" : isPost ? "Post" : "Reply"}
        </button>
      </div>
      {state && "error" in state && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
