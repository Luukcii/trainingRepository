// Review reads and writes. Server-only (it touches the database).
import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { review, user } from "./db/schema";

export async function listReviews(projectSlug: string) {
  return db
    .select({
      id: review.id,
      userId: review.userId,
      name: user.name,
      approval: review.approval,
      comment: review.comment,
      updatedAt: review.updatedAt,
    })
    .from(review)
    .innerJoin(user, eq(review.userId, user.id))
    .where(eq(review.projectSlug, projectSlug))
    .orderBy(desc(review.updatedAt));
}

// Insert, or update this member's existing review of the project (one each).
export async function saveReview(userId: string, projectSlug: string, approval: number, comment: string) {
  await db
    .insert(review)
    .values({ id: randomUUID(), userId, projectSlug, approval, comment })
    .onConflictDoUpdate({
      target: [review.userId, review.projectSlug],
      set: { approval, comment, updatedAt: new Date() },
    });
}

export async function deleteReview(id: string) {
  const [row] = await db.delete(review).where(eq(review.id, id)).returning({ projectSlug: review.projectSlug });
  return row ?? null;
}
