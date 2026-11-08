"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { findMember } from "@/lib/friends";
import { addComment, addPost, canWrite, deleteComment, deletePost, findPost, wroteSince } from "@/lib/wall";
import { logActivity } from "@/lib/activity";

const MAX_PER_MINUTE = 5; // posts + comments together

const Id = z.string().min(1).max(100);
const PostInput = z.object({
  wallOwnerId: Id,
  body: z.string().trim().min(1, "Write something first.").max(500, "Keep it under 500 characters."),
});
const CommentInput = z.object({
  postId: Id,
  body: z.string().trim().min(1, "Write something first.").max(300, "Keep it under 300 characters."),
});

export type WallState = { error: string } | { ok: true } | null;

export async function postOnWallAction(_prev: WallState, form: FormData): Promise<WallState> {
  const me = await requireUser();
  const parsed = PostInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { wallOwnerId, body } = parsed.data;

  // The form only shows for friends, but anyone can call this action directly. Check again.
  const owner = await findMember(wallOwnerId);
  if (!owner || !(await canWrite(me.id, owner.id))) return { error: "Only friends can post on this wall." };
  if ((await wroteSince(me.id, 60)) >= MAX_PER_MINUTE) return { error: "Slow down a little, then try again." };

  await addPost(owner.id, me.id, body);
  await logActivity(me.id, "wall_post", owner.id === me.id ? "posted on their own wall" : `posted on ${owner.name}'s wall`);
  refresh();
  return { ok: true };
}

export async function commentAction(_prev: WallState, form: FormData): Promise<WallState> {
  const me = await requireUser();
  const parsed = CommentInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const post = await findPost(parsed.data.postId);
  if (!post || !(await canWrite(me.id, post.wallOwnerId))) return { error: "Only friends can comment on this wall." };
  if ((await wroteSince(me.id, 60)) >= MAX_PER_MINUTE) return { error: "Slow down a little, then try again." };

  await addComment(post.id, me.id, parsed.data.body);
  const owner = await findMember(post.wallOwnerId);
  await logActivity(me.id, "wall_comment", `commented on ${owner?.id === me.id ? "their own" : `${owner?.name}'s`} wall`);
  refresh();
  return { ok: true };
}

export async function deleteWallPostAction(form: FormData) {
  const me = await requireUser();
  await deletePost(me, Id.parse(form.get("id")));
  refresh();
}

export async function deleteWallCommentAction(form: FormData) {
  const me = await requireUser();
  await deleteComment(me, Id.parse(form.get("id")));
  refresh();
}
