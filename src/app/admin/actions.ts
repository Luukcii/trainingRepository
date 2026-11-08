"use server"; // these functions run on the server; forms call them like a hidden API

import { refresh } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/session";
import { createInvite } from "@/lib/invites";
import { logActivity } from "@/lib/activity";
import { roleTitle, warAccountRoles } from "@/lib/war/roles";
import { setWarRole } from "@/lib/war/staff";

// Promote or demote a war account (player / mod / tech). Admin only, checked here: a Server Action is a
// public door, so anyone could call it with a made-up form. Zod allows only those three roles, and
// setWarRole only touches Discord-made accounts, so this can never create another admin.
const roleForm = z.object({ userId: z.string().min(1).max(100), role: z.enum(warAccountRoles) });

export async function setWarRoleAction(form: FormData) {
  const admin = await requireAdmin();
  const parsed = roleForm.safeParse({ userId: form.get("userId"), role: form.get("role") });
  if (!parsed.success) return;
  const username = await setWarRole(parsed.data.userId, parsed.data.role);
  if (username) await logActivity(admin.id, "war_role", `made @${username} a ${roleTitle[parsed.data.role]}`);
  refresh();
}

export async function createInviteAction(): Promise<{ link: string }> {
  const admin = await requireAdmin(); // checked here too: anyone can call a Server Action directly
  const token = await createInvite(admin.id);
  return { link: `${process.env.BETTER_AUTH_URL}/join/${token}` };
}
