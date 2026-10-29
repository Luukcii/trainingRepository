"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { findMember } from "@/lib/friends";
import { blockMember, unblockMember } from "@/lib/blocks";
import { logActivity } from "@/lib/activity";

const Id = z.string().min(1).max(100);

export async function blockAction(form: FormData) {
  const me = await requireUser();
  const them = await findMember(Id.parse(form.get("userId")));
  if (!them || them.id === me.id) return;

  await blockMember(me.id, them.id);
  await logActivity(me.id, "block", `blocked ${them.name}`);
  refresh();
}

export async function unblockAction(form: FormData) {
  const me = await requireUser();
  await unblockMember(me.id, Id.parse(form.get("userId")));
  refresh();
}
