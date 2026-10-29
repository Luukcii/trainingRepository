// Direct messages. Callers must check isBlocked() first; these functions only touch the table.
import { randomUUID } from "node:crypto";
import { and, count, desc, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "./db";
import { message } from "./db/schema";

const conversation = (a: string, b: string) =>
  or(and(eq(message.fromId, a), eq(message.toId, b)), and(eq(message.fromId, b), eq(message.toId, a)));

// The latest messages between two people, oldest first (chat order).
export async function listConversation(a: string, b: string, limit = 100) {
  const rows = await db.select().from(message).where(conversation(a, b)).orderBy(desc(message.createdAt)).limit(limit);
  return rows.reverse();
}

export async function sendMessage(fromId: string, toId: string, body: string) {
  await db.insert(message).values({ id: randomUUID(), fromId, toId, body });
}

export async function markRead(me: string, from: string) {
  await db
    .update(message)
    .set({ readAt: new Date() })
    .where(and(eq(message.fromId, from), eq(message.toId, me), isNull(message.readAt)));
}

// Unread messages to me, counted per sender.
export async function unreadBySender(me: string) {
  const rows = await db
    .select({ fromId: message.fromId, n: count() })
    .from(message)
    .where(and(eq(message.toId, me), isNull(message.readAt)))
    .groupBy(message.fromId);
  return new Map(rows.map((r) => [r.fromId, r.n]));
}

export async function sentSince(fromId: string, seconds: number) {
  const since = new Date(Date.now() - seconds * 1000);
  const [row] = await db.select({ n: count() }).from(message).where(and(eq(message.fromId, fromId), gt(message.createdAt, since)));
  return row.n;
}
