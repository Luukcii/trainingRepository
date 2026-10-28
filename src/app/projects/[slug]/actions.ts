"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireUser } from "@/lib/session";
import { deleteReview, saveReview } from "@/lib/reviews";
import { logActivity } from "@/lib/activity";
import { findProject } from "@/content/projects";

const ReviewInput = z.object({
  slug: z.string().refine((s) => findProject(s), "Unknown project."),
  approval: z.coerce.number().int().min(0, "Pick 0–100%.").max(100, "Pick 0–100%."),
  comment: z.string().trim().max(1000, "Keep the comment under 1000 characters.").default(""),
});

export type ReviewState = { error: string } | { ok: true } | null;

export async function saveReviewAction(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  const user = await requireUser();
  const parsed = ReviewInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { slug, approval, comment } = parsed.data;

  await saveReview(user.id, slug, approval, comment);
  await logActivity(user.id, "review", `rated ${findProject(slug)!.title} ${approval}%`);
  refresh();
  return { ok: true };
}

export async function deleteReviewAction(form: FormData) {
  const admin = await requireAdmin();
  const deleted = await deleteReview(z.uuid().parse(form.get("id")));
  if (deleted) await logActivity(admin.id, "review_delete", `deleted a review of ${findProject(deleted.projectSlug)?.title ?? deleted.projectSlug}`);
  refresh();
}
