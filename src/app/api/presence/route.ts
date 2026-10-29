// GET /api/presence — the sidebar's heartbeat. Marks me online and returns my friends' status,
// plus unread messages from members who aren't friends. Only friends see each other's online status.
import { inArray } from "drizzle-orm";
import { getUser } from "@/lib/session";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { listFriends, pendingRequestCount } from "@/lib/friends";
import { onlineIds, touchPresence } from "@/lib/presence";
import { unreadBySender } from "@/lib/messages";
import { hiddenIds } from "@/lib/blocks";
import { looksFor } from "@/lib/profiles";
import type { ColorKey, EmblemKey } from "@/content/player-card";

type Person = { id: string; name: string; emblem: EmblemKey; color: ColorKey; emblemImage?: string; unread: number };

export type PresenceResponse =
  | { signedIn: false }
  | { signedIn: true; pending: number; friends: (Person & { online: boolean })[]; others: Person[] };

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ signedIn: false } satisfies PresenceResponse);

  await touchPresence(user.id);
  const [friends, unread, pending, hidden] = await Promise.all([
    listFriends(user.id),
    unreadBySender(user.id),
    pendingRequestCount(user.id),
    hiddenIds(user.id),
  ]);
  const friendIds = new Set(friends.map((f) => f.id));
  const otherIds = [...unread.keys()].filter((id) => !friendIds.has(id) && !hidden.has(id));
  const [online, looks, others] = await Promise.all([
    onlineIds([...friendIds]),
    looksFor([...friendIds, ...otherIds]),
    otherIds.length
      ? db.select({ id: userTable.id, name: userTable.name }).from(userTable).where(inArray(userTable.id, otherIds))
      : [],
  ]);
  const person = (p: { id: string; name: string }): Person => {
    const { look } = looks.get(p.id)!;
    return { ...p, emblem: look.emblem, color: look.color, emblemImage: look.emblemImage, unread: unread.get(p.id) ?? 0 };
  };

  return Response.json({
    signedIn: true,
    pending,
    friends: friends.map((f) => ({ ...person(f), online: online.has(f.id) })),
    others: others.map(person),
  } satisfies PresenceResponse);
}
