"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createPlayerAccount } from "@/lib/war/accounts";

// Checked on the server: the browser's checks are only a courtesy.
const JoinInput = z
  .object({
    token: z.string().min(20).max(100),
    password: z.string().min(12, "Password needs at least 12 characters.").max(128, "Password is too long."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "The two passwords don't match." });

export type WarJoinState = { error: string } | null;

export async function warJoinAction(_prev: WarJoinState, form: FormData): Promise<WarJoinState> {
  const parsed = JoinInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const result = await createPlayerAccount(parsed.data.token, parsed.data.password);
  if (!result.ok) return { error: result.error };
  redirect("/war/login?joined=1");
}
