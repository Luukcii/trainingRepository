"use server"; // these functions run on the server; forms call them like a hidden API

import { refresh } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/session";
import { createInvite } from "@/lib/invites";
import { logActivity } from "@/lib/activity";
import { roleTitle, warAccountRoles } from "@/lib/war/roles";
import { setWarRoleAndTitle } from "@/lib/war/staff";
import { findTitle, staffTitleKeys } from "@/content/war/titles";

// Set a war account's role (player / mod / tech) and title (Owner, Head Human Resources… or none). Admin only, checked here: a
// Server Action is a public door, so anyone could call it with a made-up form. Zod allows only those roles and
// titles, and setWarRoleAndTitle only touches Discord-made accounts, so this can never create another admin.
const roleForm = z.object({
  userId: z.string().min(1).max(100),
  role: z.enum(warAccountRoles),
  title: z.union([z.enum(staffTitleKeys), z.literal("")]),
});

export async function setWarRoleAction(form: FormData) {
  const admin = await requireAdmin();
  const parsed = roleForm.safeParse({ userId: form.get("userId"), role: form.get("role"), title: form.get("title") ?? "" });
  if (!parsed.success) return;
  const { userId, role, title } = parsed.data;
  const username = await setWarRoleAndTitle(userId, role, title || null);
  const titleText = findTitle(title)?.label ?? "no title";
  if (username) await logActivity(admin.id, "war_role", `set @${username}: ${roleTitle[role]}, ${titleText}`);
  refresh();
}

export async function createInviteAction(): Promise<{ link: string }> {
  const admin = await requireAdmin(); // checked here too: anyone can call a Server Action directly
  const token = await createInvite(admin.id);
  return { link: `${process.env.BETTER_AUTH_URL}/join/${token}` };
}
