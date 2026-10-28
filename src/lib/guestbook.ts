// Guestbook reads and writes. Server-only (it touches the database).
import { randomUUID } from "node:crypto";
import { and, count, desc, eq, gt } from "drizzle-orm";
import { db } from "./db";
import { guestbookEntry, user } from "./db/schema";

export async function listEntries(limit = 100) {
  return db
    .select({ id: guestbookEntry.id, body: guestbookEntry.body, createdAt: guestbookEntry.createdAt, name: user.name })
    .from(guestbookEntry)
    .innerJoin(user, eq(guestbookEntry.userId, user.id))
    .orderBy(desc(guestbookEntry.createdAt))
    .limit(limit);
}

// How many posts this user made recently: the flood limit.
export async function recentPostCount(userId: string, minutes: number) {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  const [row] = await db
    .select({ n: count() })
    .from(guestbookEntry)
    .where(and(eq(guestbookEntry.userId, userId), gt(guestbookEntry.createdAt, since)));
  return row.n;
}

export async function addEntry(userId: string, body: string) {
  await db.insert(guestbookEntry).values({ id: randomUUID(), userId, body });
}

export async function deleteEntry(id: string) {
  const [row] = await db.delete(guestbookEntry).where(eq(guestbookEntry.id, id)).returning({ body: guestbookEntry.body });
  return row ?? null;
}
