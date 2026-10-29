// Friend requests and friend lists. Every write checks that the row involves the person asking.
import { randomUUID } from "node:crypto";
import { and, count, eq, inArray, ne, or } from "drizzle-orm";
import { db } from "./db";
import { friendship, user } from "./db/schema";
import { hiddenIds, isBlocked } from "./blocks";

export type Relation = "none" | "friends" | "sent" | "received";

const between = (a: string, b: string) =>
  or(
    and(eq(friendship.requesterId, a), eq(friendship.addresseeId, b)),
    and(eq(friendship.requesterId, b), eq(friendship.addresseeId, a)),
  );
const involves = (me: string) => or(eq(friendship.requesterId, me), eq(friendship.addresseeId, me));

function relationOf(me: string, link: typeof friendship.$inferSelect | undefined): Relation {
  if (!link) return "none";
  if (link.status === "accepted") return "friends";
  return link.requesterId === me ? "sent" : "received";
}

export async function findMember(id: string) {
  const [row] = await db.select({ id: user.id, name: user.name }).from(user).where(eq(user.id, id)).limit(1);
  return row ?? null;
}

export async function areFriends(a: string, b: string) {
  const [row] = await db
    .select({ id: friendship.id })
    .from(friendship)
    .where(and(between(a, b), eq(friendship.status, "accepted")))
    .limit(1);
  return Boolean(row);
}

// Send a request. If they already asked you, this accepts theirs instead. Blocked either way: refused.
export async function sendFriendRequest(me: string, them: string): Promise<"sent" | "accepted" | "exists" | "blocked"> {
  if (await isBlocked(me, them)) return "blocked";
  const [existing] = await db.select().from(friendship).where(between(me, them)).limit(1);
  if (!existing) {
    await db.insert(friendship).values({ id: randomUUID(), requesterId: me, addresseeId: them });
    return "sent";
  }
  if (existing.status === "pending" && existing.addresseeId === me) {
    await db.update(friendship).set({ status: "accepted" }).where(eq(friendship.id, existing.id));
    return "accepted";
  }
  return "exists";
}

// Only the person a request was sent TO can accept it.
export async function acceptFriendRequest(me: string, id: string) {
  const [row] = await db
    .update(friendship)
    .set({ status: "accepted" })
    .where(and(eq(friendship.id, id), eq(friendship.addresseeId, me), eq(friendship.status, "pending")))
    .returning({ otherId: friendship.requesterId });
  return row?.otherId ?? null;
}

// Decline, cancel, or unfriend: delete the row, but only if it's yours.
export async function removeFriendship(me: string, id: string) {
  await db.delete(friendship).where(and(eq(friendship.id, id), involves(me)));
}

export async function listFriends(me: string) {
  const rows = await db
    .select({ requesterId: friendship.requesterId, addresseeId: friendship.addresseeId })
    .from(friendship)
    .where(and(involves(me), eq(friendship.status, "accepted")));
  const ids = rows.map((r) => (r.requesterId === me ? r.addresseeId : r.requesterId));
  if (ids.length === 0) return [];
  return db.select({ id: user.id, name: user.name }).from(user).where(inArray(user.id, ids)).orderBy(user.name);
}

export async function pendingRequestCount(me: string) {
  const [row] = await db
    .select({ n: count() })
    .from(friendship)
    .where(and(eq(friendship.addresseeId, me), eq(friendship.status, "pending")));
  return row.n;
}

// Everyone else on the site (minus blocks), with how they relate to me. Small site: one list is fine.
export async function membersWithRelation(me: string) {
  const [people, links, hidden] = await Promise.all([
    db.select({ id: user.id, name: user.name }).from(user).where(ne(user.id, me)).orderBy(user.name),
    db.select().from(friendship).where(involves(me)),
    hiddenIds(me),
  ]);
  return people.filter((p) => !hidden.has(p.id)).map((p) => {
    const link = links.find((l) => l.requesterId === p.id || l.addresseeId === p.id);
    return { ...p, relation: relationOf(me, link), friendshipId: link?.id ?? null };
  });
}

// How one member relates to me, for their profile page.
export async function relationTo(me: string, them: string) {
  const [link] = await db.select().from(friendship).where(between(me, them)).limit(1);
  return { relation: relationOf(me, link), friendshipId: link?.id ?? null };
}
