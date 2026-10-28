// The one place that answers "who is logged in, and what may they do?"
// Every protected page and action calls one of these, on the server.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

// Authentication: are you anyone? Not logged in → /login.
export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const { id, name, email, role } = session.user;
  return { id, name, email, role };
}

// Authorization: are you allowed in here? Members go back to the public site.
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}
