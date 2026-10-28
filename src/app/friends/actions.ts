"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { acceptFriendRequest, findMember, removeFriendship, sendFriendRequest } from "@/lib/friends";
import { logActivity } from "@/lib/activity";

const Id = z.string().min(1).max(100);

export async function sendFriendRequestAction(form: FormData) {
  const me = await requireUser();
  const them = await findMember(Id.parse(form.get("userId")));
  if (!them || them.id === me.id) return;

  const result = await sendFriendRequest(me.id, them.id);
  if (result === "sent") await logActivity(me.id, "friend_request", `sent a friend request to ${them.name}`);
  if (result === "accepted") await logActivity(me.id, "friend_accept", `became friends with ${them.name}`);
  refresh();
}

export async function acceptFriendAction(form: FormData) {
  const me = await requireUser();
  const otherId = await acceptFriendRequest(me.id, Id.parse(form.get("id")));
  const other = otherId && (await findMember(otherId));
  if (other) await logActivity(me.id, "friend_accept", `became friends with ${other.name}`);
  refresh();
}

// Decline a request, cancel one you sent, or unfriend.
export async function removeFriendAction(form: FormData) {
  const me = await requireUser();
  await removeFriendship(me.id, Id.parse(form.get("id")));
  refresh();
}
