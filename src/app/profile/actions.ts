"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { saveProfile } from "@/lib/profiles";
import { logActivity } from "@/lib/activity";
import { banners, emblemColors, emblems, type BannerKey, type ColorKey, type EmblemKey } from "@/content/player-card";

// Only keys from our own lists get through, so the page can never be fed someone's CSS.
const keysOf = <K extends string>(obj: Record<K, unknown>) => Object.keys(obj) as [K, ...K[]];

const ProfileInput = z.object({
  callsign: z.string().trim().max(24, "Keep your callsign to 24 characters."),
  bio: z.string().trim().max(280, "Keep your bio to 280 characters."),
  banner: z.enum(keysOf<BannerKey>(banners)),
  emblem: z.enum(keysOf<EmblemKey>(emblems)),
  color: z.enum(keysOf<ColorKey>(emblemColors)),
});

export type ProfileState = { error: string } | { ok: true } | null;

export async function saveProfileAction(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const me = await requireUser();
  const parsed = ProfileInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await saveProfile(me.id, parsed.data);
  await logActivity(me.id, "profile_update", "updated their player card");
  refresh();
  return { ok: true };
}
