// The one place that answers "who is logged in, and what may they do?"
// Every protected page and action calls one of these, on the server.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "./auth";

// For pages anyone can see: the user if logged in, otherwise null.
export async function getUser() {
  // Wait for a real visitor. Without this, Next.js starts the session lookup while building pages early
  // (prefetching), cuts it off, and Better Auth logs the error — with the session token in it.
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const { id, name, email, role } = session.user;
  return { id, name, email, role };
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
