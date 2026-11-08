// War staff: who they are, what they've recorded, and how the admin promotes them. Server-only.
import { and, asc, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, warEvent } from "@/lib/db/schema";
import { warAccountRoles, warStaffRoles, type WarAccountRole } from "./roles";

const staffAndAdmin = ["admin", ...warStaffRoles];
const columns = { id: user.id, name: user.name, username: user.username, role: user.role, discordId: user.discordId, warFaction: user.warFaction, createdAt: user.createdAt };

// Everyone on staff, admin first, then by name. Names and titles only: no emails, no Discord ids leave this list.
export async function listStaff() {
  const rows = await db
    .select({ id: user.id, name: user.name, username: user.username, role: user.role })
    .from(user)
    .where(inArray(user.role, staffAndAdmin))
    .orderBy(asc(user.name));
  return rows.sort((a, b) => Number(b.role === "admin") - Number(a.role === "admin"));
}

// One staff member's profile, or null if this id isn't staff (so the page can't be used to look up players).
export async function getStaffMember(id: string) {
  const [row] = await db
    .select(columns)
    .from(user)
    .where(and(eq(user.id, id), inArray(user.role, staffAndAdmin)))
    .limit(1);
  return row ?? null;
}

// What this person has recorded through God, newest first. Includes secret moves, so only staff may see it.
export async function staffRecord(discordId: string | null, limit = 50) {
  if (!discordId) return [];
  return db
    .select({ id: warEvent.id, at: warEvent.at, kind: warEvent.kind, summary: warEvent.summary, faction: warEvent.faction, secret: warEvent.secret })
    .from(warEvent)
    .where(eq(warEvent.actor, discordId))
    .orderBy(desc(warEvent.at))
    .limit(limit);
}

// Every Discord-made account, for the admin's promote/demote list.
export async function listWarAccounts() {
  return db
    .select(columns)
    .from(user)
    .where(and(inArray(user.role, [...warAccountRoles]), isNotNull(user.discordId)))
    .orderBy(asc(user.username));
}

// Only ever moves an account between player / mod / tech. The WHERE makes sure an admin or a members'-site
// account can never be touched from here, whatever id the form sends.
export async function setWarRole(userId: string, role: WarAccountRole) {
  const rows = await db
    .update(user)
    .set({ role })
    .where(and(eq(user.id, userId), inArray(user.role, [...warAccountRoles]), isNotNull(user.discordId)))
    .returning({ name: user.username });
  return rows[0]?.name ?? null;
}
