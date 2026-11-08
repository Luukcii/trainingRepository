// Faction-war accounts: one-time sign-up links from the Discord bot, creating the account, choosing a faction.
// Server-only (it touches the database). The flow:
//   1. A player types /war join in the HAFW Discord. Discord tells us exactly who they are (their user id),
//      so the bot makes a sign-up link tied to that Discord account and shows it only to them.
//   2. The link's page lets them set a password. The account's username is their Discord username.
//   3. They log in with Discord username + password, then pick a faction once.
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, warJoinToken } from "@/lib/db/schema";
import { signupAuth } from "@/lib/signup-auth";
import { factionIds, type FactionId } from "@/content/war/map";

const LINK_MINUTES = 30; // short: the link is a key to someone's Discord identity

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Discord usernames are already lowercase a–z, 0–9, "_" and "."; older accounts may still carry "#1234".
function cleanUsername(raw: string) {
  return raw.toLowerCase().replace(/#\d+$/, "").replace(/[^a-z0-9_.]/g, "").slice(0, 32);
}

export type JoinLink = { kind: "link"; token: string; minutes: number } | { kind: "exists"; username: string };

// Called by the bot. Gives back a fresh link, or says this Discord account already has an account.
export async function createJoinLink(discordId: string, discordUsername: string, displayName: string): Promise<JoinLink> {
  const [existing] = await db.select({ username: user.username }).from(user).where(eq(user.discordId, discordId)).limit(1);
  if (existing) return { kind: "exists", username: existing.username ?? cleanUsername(discordUsername) };

  const username = cleanUsername(discordUsername);
  if (username.length < 2) throw new Error("unusable Discord username");

  // Only the newest link works: running /war join again cancels older ones.
  await db.delete(warJoinToken).where(and(eq(warJoinToken.discordId, discordId), isNull(warJoinToken.usedAt)));
  const token = randomBytes(32).toString("base64url"); // 256 random bits: unguessable
  await db.insert(warJoinToken).values({
    id: randomUUID(),
    tokenHash: hashToken(token),
    discordId,
    discordUsername: username,
    displayName: displayName.trim().slice(0, 60) || username,
    expiresAt: new Date(Date.now() + LINK_MINUTES * 60_000),
  });
  return { kind: "link", token, minutes: LINK_MINUTES };
}

const usable = (token: string) =>
  and(eq(warJoinToken.tokenHash, hashToken(token)), isNull(warJoinToken.usedAt), gt(warJoinToken.expiresAt, new Date()));

// For the sign-up page: whose link is this? null = used up, expired or made up.
export async function readJoinLink(token: string) {
  const [row] = await db
    .select({ discordUsername: warJoinToken.discordUsername, displayName: warJoinToken.displayName })
    .from(warJoinToken)
    .where(usable(token))
    .limit(1);
  return row ?? null;
}

export type CreateResult = { ok: true; username: string } | { ok: false; error: string };

// Uses the link up in one step (so it can't be used twice at once), then makes the account.
export async function createPlayerAccount(token: string, password: string): Promise<CreateResult> {
  const [link] = await db.update(warJoinToken).set({ usedAt: new Date() }).where(usable(token)).returning();
  if (!link) return { ok: false, error: "This sign-up link is used up or expired. Type /war join in Discord for a new one." };

  let userId: string | null = null;
  try {
    const { user: created } = await signupAuth.api.signUpEmail({
      body: {
        name: link.displayName,
        // Better Auth needs an email; players log in by username, so this placeholder is never shown or emailed.
        // ".invalid" is reserved: it can never be a real address.
        email: `${link.discordId}@discord.invalid`,
        password,
        username: link.discordUsername,
      },
    });
    userId = created.id;
    // Mark it as a war account and tie it to the proven Discord account.
    await db.update(user).set({ role: "player", discordId: link.discordId }).where(eq(user.id, userId));
    return { ok: true, username: link.discordUsername };
  } catch {
    // Never leave a half-made account behind: it would be a plain member with the members' site open.
    if (userId) await db.delete(user).where(eq(user.id, userId)).catch(() => {});
    await db.update(warJoinToken).set({ usedAt: null }).where(eq(warJoinToken.id, link.id));
    return { ok: false, error: "Couldn't create the account. If you already have one, log in instead." };
  }
}

// A player picks their faction once. Changing later is a 600-Gold faction swap, done by staff.
export async function chooseFaction(userId: string, faction: FactionId) {
  if (!factionIds.includes(faction)) return false;
  const rows = await db
    .update(user)
    .set({ warFaction: faction })
    .where(and(eq(user.id, userId), eq(user.role, "player"), isNull(user.warFaction)))
    .returning({ id: user.id });
  return rows.length === 1;
}

// For the bot: which faction (if any) is this Discord account sworn to?
export async function factionOfDiscordUser(discordId: string): Promise<FactionId | null> {
  const [row] = await db.select({ warFaction: user.warFaction }).from(user).where(eq(user.discordId, discordId)).limit(1);
  const f = row?.warFaction;
  return f && factionIds.includes(f as FactionId) ? (f as FactionId) : null;
}
