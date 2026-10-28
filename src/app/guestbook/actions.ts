"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireUser } from "@/lib/session";
import { addEntry, deleteEntry, recentPostCount } from "@/lib/guestbook";
import { logActivity } from "@/lib/activity";

const MAX_POSTS = 5; // per member…
const WINDOW_MINUTES = 10; // …in this many minutes

const PostInput = z.object({
  body: z.string().trim().min(1, "Write something first.").max(500, "Keep it under 500 characters."),
});

export type PostState = { error: string } | { ok: true } | null;

export async function postEntryAction(_prev: PostState, form: FormData): Promise<PostState> {
  const user = await requireUser();
  const parsed = PostInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if ((await recentPostCount(user.id, WINDOW_MINUTES)) >= MAX_POSTS) {
    return { error: "That's a lot of posts. Take a break and try again in a few minutes." };
  }

  await addEntry(user.id, parsed.data.body);
  await logActivity(user.id, "guestbook_post", `signed the guestbook: "${preview(parsed.data.body)}"`);
  refresh(); // re-render the page so the new post shows
  return { ok: true };
}

export async function deleteEntryAction(form: FormData) {
  const admin = await requireAdmin();
  const id = z.uuid().parse(form.get("id"));
  const deleted = await deleteEntry(id);
  if (deleted) await logActivity(admin.id, "guestbook_delete", `deleted a guestbook post: "${preview(deleted.body)}"`);
  refresh();
}

function preview(text: string) {
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}
