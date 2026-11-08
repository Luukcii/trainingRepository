// The one place that answers "who is logged in, and what may they do?"
// Every protected page and action calls one of these, on the server.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "./auth";
import { isWarOnlyRole } from "./war/roles";

async function currentSession() {
  // Wait for a real visitor. Without this, Next.js starts the session lookup while building pages early
  // (prefetching), cuts it off, and Better Auth logs the error — with the session token in it.
  await connection();
  return auth.api.getSession({ headers: await headers() });
}

// For the members' site (friends, messages, profiles…): the user if logged in, otherwise null.
// Faction-war accounts (player, mod, tech) sign up through Discord, not by invite, so the members' site
// treats them as visitors: a war account never opens the invite-only community.
export async function getUser() {
  const session = await currentSession();
  if (!session || isWarOnlyRole(session.user.role)) return null;
  const { id, name, email, role } = session.user;
  return { id, name, email, role };
}

// For the faction-war pages: anyone logged in, players included, with their war details.
export async function getWarUser() {
  const session = await currentSession();
  if (!session) return null;
  const { id, name, role, username, discordId, warFaction } = session.user;
  return { id, name, role, username: username ?? null, discordId: discordId ?? null, warFaction: warFaction ?? null };
}

// Authentication: are you anyone? Not logged in → /login.
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

// Authorization: are you allowed in here? Members go back to the public site.
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}
