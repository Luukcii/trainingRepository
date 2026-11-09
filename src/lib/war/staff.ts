// War staff: who they are, what they've recorded, and how the admin sets roles and titles. Server-only.
import { and, asc, desc, eq, inArray, isNotNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, warEvent } from "@/lib/db/schema";
import { findTitle, staffTitles, type StaffTitleKey } from "@/content/war/titles";
import { warAccountRoles, warStaffRoles, type WarAccountRole } from "./roles";

const staffAndAdmin = ["admin", ...warStaffRoles];
const columns = {
  id: user.id,
  name: user.name,
  username: user.username,
  role: user.role,
  warTitle: user.warTitle,
  discordId: user.discordId,
  warFaction: user.warFaction,
  createdAt: user.createdAt,
};

// On staff = admin, a mod or tech, or anyone given a title (a Faction Leader may be an ordinary player).
const onStaff = or(inArray(user.role, staffAndAdmin), isNotNull(user.warTitle));

// Who a logged-out visitor may see: Max, and people with a public title. Everyone else stays unmentioned.
export function isPublicStaff(p: { role: string; warTitle: string | null }) {
  return p.role === "admin" || Boolean(findTitle(p.warTitle)?.public);
}

// Order: Max first, then by title (in the order of staffTitles), then mods/techs without a title, then by name.
function rank(p: { role: string; warTitle: string | null }) {
  if (p.role === "admin") return -1;
  const i = staffTitles.findIndex((t) => t.key === p.warTitle);
  return i === -1 ? staffTitles.length : i;
}

// Everyone on staff. Names and titles only: no emails, no Discord ids leave this list.
export async function listStaff() {
  const rows = await db
    .select({ id: user.id, name: user.name, username: user.username, role: user.role, warTitle: user.warTitle })
    .from(user)
    .where(onStaff)
    .orderBy(asc(user.name));
  return rows.sort((a, b) => rank(a) - rank(b));
}

// One staff member's profile, or null if this id isn't staff (so the page can't be used to look up players).
export async function getStaffMember(id: string) {
  const [row] = await db.select(columns).from(user).where(and(eq(user.id, id), onStaff)).limit(1);
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

// Every Discord-made account, for the admin's role and title list.
export async function listWarAccounts() {
  return db
    .select(columns)
    .from(user)
    .where(and(inArray(user.role, [...warAccountRoles]), isNotNull(user.discordId)))
    .orderBy(asc(user.username));
}

// Only ever touches Discord-made accounts, and only moves the role between player / mod / tech. The WHERE makes
// sure an admin or a members'-site account can never be changed from here, whatever id the form sends.
export async function setWarRoleAndTitle(userId: string, role: WarAccountRole, title: StaffTitleKey | null) {
  const rows = await db
    .update(user)
    .set({ role, warTitle: title })
    .where(and(eq(user.id, userId), inArray(user.role, [...warAccountRoles]), isNotNull(user.discordId)))
    .returning({ name: user.username });
  return rows[0]?.name ?? null;
}
