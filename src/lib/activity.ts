// Writes and reads the activity logbook. Every member action calls logActivity once.
import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { activity, user } from "./db/schema";

export type ActivityType =
  | "joined"
  | "signed_in"
  | "guestbook_post"
  | "guestbook_delete"
  | "review"
  | "review_delete"
  | "friend_request"
  | "friend_accept"
  | "message"
  | "profile_update"
  | "block"
  | "upload"
  | "picture_removed";

export async function logActivity(userId: string, type: ActivityType, summary: string) {
  await db.insert(activity).values({ id: randomUUID(), userId, type, summary });
}

export async function recentActivity(limit = 50) {
  return db
    .select({ id: activity.id, name: user.name, summary: activity.summary, createdAt: activity.createdAt })
    .from(activity)
    .innerJoin(user, eq(activity.userId, user.id))
    .orderBy(desc(activity.createdAt))
    .limit(limit);
}
