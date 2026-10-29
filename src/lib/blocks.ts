// Blocking. A block works both ways: neither person can friend, message, or find the other.
import { and, eq, isNull, or } from "drizzle-orm";
import { db } from "./db";
import { block, friendship, message, user } from "./db/schema";

const between = (a: string, b: string) =>
  or(and(eq(block.blockerId, a), eq(block.blockedId, b)), and(eq(block.blockerId, b), eq(block.blockedId, a)));

export async function isBlocked(a: string, b: string) {
  const [row] = await db.select({ id: block.blockerId }).from(block).where(between(a, b)).limit(1);
  return Boolean(row);
}

export async function iBlocked(me: string, them: string) {
  const [row] = await db
    .select({ id: block.blockerId })
    .from(block)
    .where(and(eq(block.blockerId, me), eq(block.blockedId, them)))
    .limit(1);
  return Boolean(row);
}

// Everyone on either side of a block with me: these people are hidden from my lists.
export async function hiddenIds(me: string) {
  const rows = await db.select().from(block).where(or(eq(block.blockerId, me), eq(block.blockedId, me)));
  return new Set(rows.map((r) => (r.blockerId === me ? r.blockedId : r.blockerId)));
}

// Block: also ends any friendship or request, and clears their unread messages so no badge lingers.
export async function blockMember(me: string, them: string) {
  await db.insert(block).values({ blockerId: me, blockedId: them }).onConflictDoNothing();
  await db
    .delete(friendship)
    .where(
      or(
        and(eq(friendship.requesterId, me), eq(friendship.addresseeId, them)),
        and(eq(friendship.requesterId, them), eq(friendship.addresseeId, me)),
      ),
    );
  await db
    .update(message)
    .set({ readAt: new Date() })
    .where(and(eq(message.fromId, them), eq(message.toId, me), isNull(message.readAt)));
}

// Only the blocker can lift a block.
export async function unblockMember(me: string, them: string) {
  await db.delete(block).where(and(eq(block.blockerId, me), eq(block.blockedId, them)));
}

export async function listBlocked(me: string) {
  return db
    .select({ id: user.id, name: user.name })
    .from(block)
    .innerJoin(user, eq(user.id, block.blockedId))
    .where(eq(block.blockerId, me))
    .orderBy(user.name);
}
