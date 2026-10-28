// Invite links: make one, check one, use one up. Server-only (it touches the database).
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "./db";
import { invite } from "./db/schema";

const INVITE_DAYS = 7;

// The link carries the token; the database only keeps its fingerprint (hash).
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createInvite(createdBy: string) {
  const token = randomBytes(32).toString("base64url"); // 256 random bits: unguessable
  await db.insert(invite).values({
    id: randomUUID(),
    tokenHash: hashToken(token),
    createdBy,
    expiresAt: new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000),
  });
  return token;
}

const usable = (token: string) =>
  and(eq(invite.tokenHash, hashToken(token)), isNull(invite.usedAt), gt(invite.expiresAt, new Date()));

export async function isInviteUsable(token: string) {
  const [row] = await db.select({ id: invite.id }).from(invite).where(usable(token)).limit(1);
  return Boolean(row);
}

// Marks the invite used in one step, so two people can't use the same link at once.
export async function claimInvite(token: string) {
  const [row] = await db.update(invite).set({ usedAt: new Date() }).where(usable(token)).returning({ id: invite.id });
  return row?.id ?? null;
}

export async function finishInvite(id: string, usedBy: string) {
  await db.update(invite).set({ usedBy }).where(eq(invite.id, id));
}

// Signup failed after claiming → give the link back.
export async function releaseInvite(id: string) {
  await db.update(invite).set({ usedAt: null }).where(eq(invite.id, id));
}
