// Who's online: each open browser pings every 30 s; seen in the last 90 s counts as online.
import { inArray } from "drizzle-orm";
import { db } from "./db";
import { presence } from "./db/schema";

const ONLINE_MS = 90 * 1000;

export async function touchPresence(userId: string) {
  const now = new Date();
  await db.insert(presence).values({ userId, lastSeenAt: now }).onConflictDoUpdate({ target: presence.userId, set: { lastSeenAt: now } });
}

export async function onlineIds(userIds: string[]) {
  if (userIds.length === 0) return new Set<string>();
  const rows = await db.select().from(presence).where(inArray(presence.userId, userIds));
  const cutoff = Date.now() - ONLINE_MS;
  return new Set(rows.filter((r) => r.lastSeenAt.getTime() > cutoff).map((r) => r.userId));
}
