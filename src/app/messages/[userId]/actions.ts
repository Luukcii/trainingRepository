"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { findMember } from "@/lib/friends";
import { isBlocked } from "@/lib/blocks";
import { sendMessage, sentSince } from "@/lib/messages";
import { logActivity } from "@/lib/activity";

const MAX_PER_MINUTE = 20;

const MessageInput = z.object({
  to: z.string().min(1).max(100),
  body: z.string().trim().min(1, "Type a message first.").max(1000, "Keep it under 1000 characters."),
});

export type MessageState = { error: string } | { ok: true } | null;

export async function sendMessageAction(_prev: MessageState, form: FormData): Promise<MessageState> {
  const me = await requireUser();
  const parsed = MessageInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { to, body } = parsed.data;

  // The page hides the form if there's a block, but anyone can call this action directly. Check again.
  const other = await findMember(to);
  if (!other || other.id === me.id || (await isBlocked(me.id, other.id))) return { error: "You can't message this member." };
  if ((await sentSince(me.id, 60)) >= MAX_PER_MINUTE) return { error: "Slow down a little, then try again." };

  await sendMessage(me.id, other.id, body);
  await logActivity(me.id, "message", `messaged ${other.name}`); // who, not what: message text stays private
  refresh();
  return { ok: true };
}
