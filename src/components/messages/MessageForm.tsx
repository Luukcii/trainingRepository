"use client"; // needs the browser: clears the box after sending, Enter sends

import { useActionState } from "react";
import { sendMessageAction } from "@/app/messages/[userId]/actions";

export function MessageForm({ to }: { to: string }) {
  const [state, send, pending] = useActionState(sendMessageAction, null);

  return (
    <form action={send} className="flex flex-col gap-2">
      <input type="hidden" name="to" value={to} />
      <div className="flex gap-2">
        <textarea
          name="body"
          required
          maxLength={1000}
          rows={1}
          placeholder="Write a message…"
          aria-label="Message"
          // Enter sends; Shift+Enter makes a new line.
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          className="flex-1 resize-none rounded-md border border-line bg-transparent px-3 py-2"
        />
        <button type="submit" disabled={pending} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50">
          Send
        </button>
      </div>
      {state && "error" in state && <p role="alert" className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
