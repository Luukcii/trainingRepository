"use server"; // these functions run on the server; forms call them like a hidden API

import { requireAdmin } from "@/lib/session";
import { createInvite } from "@/lib/invites";

export async function createInviteAction(): Promise<{ link: string }> {
  const admin = await requireAdmin(); // checked here too: anyone can call a Server Action directly
  const token = await createInvite(admin.id);
  return { link: `${process.env.BETTER_AUTH_URL}/join/${token}` };
}
