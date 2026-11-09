// Faction-war accounts, made by God (the Discord bot). Server-only (it touches the database). The flow:
//   1. A player types /war join in the HAFW Discord. Discord tells us exactly who they are (their user id),
//      so God makes the account on the spot, tied to that Discord account, with a random password.
//   2. God shows them the password privately, with a link to the sign-up page (/war/join).
//   3. On that page they enter their Discord username and God's password, and may choose their own.
//   4. Lost password? /war password: God proves who they are again and gives a new one.
import { randomInt } from "node:crypto";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, warSetting } from "@/lib/db/schema";
import { findTitle, type StaffTitleKey } from "@/content/war/titles";
import { auth } from "@/lib/auth";
import { signupAuth } from "@/lib/signup-auth";
import { factionIds, type FactionId } from "@/content/war/map";
import { isWarStaffRole, warAccountRoles } from "./roles";

// Discord usernames are already lowercase a–z, 0–9, "_" and "."; older accounts may still carry "#1234".
function cleanUsername(raw: string) {
  return raw.toLowerCase().replace(/#\d+$/, "").replace(/[^a-z0-9_.]/g, "").slice(0, 32);
}

// God's passwords: 16 random characters in groups of four, like "k7rm-xq2d-…". No 0/o, 1/l/i to misread.
// 31 letters ^ 16 ≈ 79 bits: far beyond guessing, even without the 5-tries-a-minute login limit.
function godPassword() {
  const letters = "abcdefghjkmnpqrstuvwxyz23456789";
  const chars = Array.from({ length: 16 }, () => letters[randomInt(letters.length)]);
  return [0, 4, 8, 12].map((i) => chars.slice(i, i + 4).join("")).join("-");
}

export type JoinResult =
  | { kind: "created"; username: string; password: string }
  | { kind: "exists"; username: string }
  | { kind: "taken" }; // the name already belongs to an account not tied to this Discord account (e.g. Max's own)

// Called by God for /war join. Makes the account, or says this Discord account already has one.
export async function createWarAccount(discordId: string, discordUsername: string, displayName: string): Promise<JoinResult> {
  const [existing] = await db.select({ username: user.username }).from(user).where(eq(user.discordId, discordId)).limit(1);
  if (existing) return { kind: "exists", username: existing.username ?? cleanUsername(discordUsername) };

  const username = cleanUsername(discordUsername);
  if (username.length < 2) throw new Error("unusable Discord username");
  // Never touch or link an account that already has this name: God only makes new ones. Linking an existing
  // account to a Discord account is done by hand, by Claude, after checking with Max.
  const [named] = await db.select({ id: user.id }).from(user).where(eq(user.username, username)).limit(1);
  if (named) return { kind: "taken" };
  const password = godPassword();

  let userId: string | null = null;
  try {
    const { user: created } = await signupAuth.api.signUpEmail({
      body: {
        name: displayName.trim().slice(0, 60) || username,
        // Better Auth needs an email; players log in by username, so this placeholder is never shown or emailed.
        // ".invalid" is reserved: it can never be a real address.
        email: `${discordId}@discord.invalid`,
        password,
        username,
      },
    });
    userId = created.id;
    // Mark it as a war account and tie it to the proven Discord account. discordId is unique, so two
    // /war join at the same moment can't make two accounts: the second fails here and is removed.
    await db.update(user).set({ role: "player", discordId, warTitle: await takeTitleOnJoin(username) }).where(eq(user.id, userId));
    return { kind: "created", username, password };
  } catch (error) {
    // Never leave a half-made account behind: it would be a plain member with the members' site open.
    if (userId) await db.delete(user).where(eq(user.id, userId)).catch(() => {});
    throw error;
  }
}

// Badges waiting for someone who hasn't joined yet (Max, 9 Nov): kept by Discord username in war_setting
// ("join_title:<username>"), not in the code, because the repo is public. On /war join the badge is put on
// the new account and the waiting entry is removed. A badge (title) is only a name tag: it grants no powers;
// mod/tech powers come from the role, which only Max sets on /admin.
const joinTitleKey = (username: string) => `join_title:${cleanUsername(username)}`;

export async function setTitleOnJoin(discordUsername: string, title: StaffTitleKey) {
  const key = joinTitleKey(discordUsername);
  await db.insert(warSetting).values({ key, value: title }).onConflictDoUpdate({ target: warSetting.key, set: { value: title } });
}

async function takeTitleOnJoin(username: string): Promise<StaffTitleKey | null> {
  const [row] = await db.delete(warSetting).where(eq(warSetting.key, joinTitleKey(username))).returning({ value: warSetting.value });
  return findTitle(row?.value)?.key ?? null;
}

// Called by God for /war password. A fresh password, and everyone logged in as this player is logged out,
// so whoever might have had the old one loses access at once. null = no war account for this Discord user.
export async function resetWarPassword(discordId: string): Promise<{ username: string; password: string } | null> {
  const [row] = await db
    .select({ id: user.id, username: user.username })
    .from(user)
    .where(and(eq(user.discordId, discordId), inArray(user.role, [...warAccountRoles]))) // players, mods and techs
    .limit(1);
  if (!row?.username) return null;
  const password = godPassword();
  const ctx = await auth.$context;
  await ctx.internalAdapter.updatePassword(row.id, await ctx.password.hash(password));
  await ctx.internalAdapter.deleteUserSessions(row.id);
  return { username: row.username, password };
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

// For God: which faction (if any) is this Discord account sworn to?
export async function factionOfDiscordUser(discordId: string): Promise<FactionId | null> {
  const [row] = await db.select({ warFaction: user.warFaction }).from(user).where(eq(user.discordId, discordId)).limit(1);
  const f = row?.warFaction;
  return f && factionIds.includes(f as FactionId) ? (f as FactionId) : null;
}

// For God: is this Discord account a mod or tech (or Max) on the site? Max sets these roles on /admin.
export async function isSiteWarStaff(discordId: string): Promise<boolean> {
  const [row] = await db.select({ role: user.role }).from(user).where(eq(user.discordId, discordId)).limit(1);
  return isWarStaffRole(row?.role);
}
