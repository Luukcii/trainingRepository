// Player cards. A member without a saved profile gets the default look.
import { eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { profile, user } from "./db/schema";
import { safeLook, type PlayerCardLook } from "@/content/player-card";

export type Card = { id: string; name: string; callsign: string; bio: string; look: PlayerCardLook };

export async function getCard(userId: string): Promise<Card | null> {
  const [row] = await db
    .select({ id: user.id, name: user.name, p: profile })
    .from(user)
    .leftJoin(profile, eq(profile.userId, user.id))
    .where(eq(user.id, userId))
    .limit(1);
  if (!row) return null;
  return { id: row.id, name: row.name, callsign: row.p?.callsign ?? "", bio: row.p?.bio ?? "", look: safeLook(row.p) };
}

// Looks for many members at once (for lists and the sidebar).
export async function looksFor(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, { callsign: string; look: PlayerCardLook }>();
  const rows = await db.select().from(profile).where(inArray(profile.userId, userIds));
  const found = new Map(rows.map((r) => [r.userId, { callsign: r.callsign, look: safeLook(r) }]));
  return new Map(userIds.map((id) => [id, found.get(id) ?? { callsign: "", look: safeLook(null) }]));
}

export async function saveProfile(userId: string, fields: { callsign: string; bio: string } & PlayerCardLook) {
  const values = { ...fields, updatedAt: new Date() };
  await db.insert(profile).values({ userId, ...values }).onConflictDoUpdate({ target: profile.userId, set: values });
}
