"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { areFriends, findMember } from "@/lib/friends";
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

  // The form only shows for friends, but anyone can call this action directly. Check again.
  const friend = await findMember(to);
  if (!friend || !(await areFriends(me.id, friend.id))) return { error: "You can only message friends." };
  if ((await sentSince(me.id, 60)) >= MAX_PER_MINUTE) return { error: "Slow down a little, then try again." };

  await sendMessage(me.id, friend.id, body);
  await logActivity(me.id, "message", `messaged ${friend.name}`); // who, not what: message text stays private
  refresh();
  return { ok: true };
}
