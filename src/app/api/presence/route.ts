// GET /api/presence — the sidebar's heartbeat. Marks me online and returns my friends' status.
// Only friends' online status is shared, never everyone's.
import { getUser } from "@/lib/session";
import { listFriends, pendingRequestCount } from "@/lib/friends";
import { onlineIds, touchPresence } from "@/lib/presence";
import { unreadBySender } from "@/lib/messages";

export type PresenceResponse =
  | { signedIn: false }
  | { signedIn: true; pending: number; friends: { id: string; name: string; online: boolean; unread: number }[] };

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ signedIn: false } satisfies PresenceResponse);

  await touchPresence(user.id);
  const friends = await listFriends(user.id);
  const [online, unread, pending] = await Promise.all([
    onlineIds(friends.map((f) => f.id)),
    unreadBySender(user.id),
    pendingRequestCount(user.id),
  ]);

  return Response.json({
    signedIn: true,
    pending,
    friends: friends.map((f) => ({ ...f, online: online.has(f.id), unread: unread.get(f.id) ?? 0 })),
  } satisfies PresenceResponse);
}
