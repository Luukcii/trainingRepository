"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { claimInvite, finishInvite, releaseInvite } from "@/lib/invites";
import { signupAuth } from "@/lib/signup-auth";

// The rules every signup must pass, checked on the server. The browser's checks are only a courtesy.
const JoinInput = z.object({
  token: z.string().min(1).max(100),
  name: z.string().trim().min(1, "Enter a name.").max(60, "Name is too long."),
  email: z.email("Enter a valid email.").max(254),
  password: z.string().min(12, "Password needs at least 12 characters.").max(128),
});

export type JoinState = { error: string } | null;

export async function joinAction(_prev: JoinState, form: FormData): Promise<JoinState> {
  const parsed = JoinInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { token, name, email, password } = parsed.data;

  const inviteId = await claimInvite(token);
  if (!inviteId) return { error: "This invite link is used up or expired. Ask Max for a new one." };

  try {
    const { user } = await signupAuth.api.signUpEmail({ body: { name, email, password } });
    await finishInvite(inviteId, user.id);
  } catch {
    await releaseInvite(inviteId); // the link still works for another try
    return { error: "Couldn't create that account. Try a different email." };
  }
  redirect("/login?joined=1");
}
