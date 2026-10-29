"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { saveProfile } from "@/lib/profiles";
import { MAX_UPLOAD_BYTES, NotAPicture, processPicture, removePicture, savePicture, uploadsLastHour } from "@/lib/uploads";
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

const Kind = z.enum(["emblem", "banner"]);
const MAX_UPLOADS_PER_HOUR = 10;

export type PictureState = { error: string } | { ok: true } | null;

export async function uploadPictureAction(_prev: PictureState, form: FormData): Promise<PictureState> {
  const me = await requireUser();
  const kind = Kind.safeParse(form.get("kind"));
  const file = form.get("file");
  if (!kind.success) return { error: "Something went wrong. Reload and try again." };
  if (!(file instanceof File) || file.size === 0) return { error: "Pick a picture first." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "That picture is too big. Keep it under 3 MB." };
  if ((await uploadsLastHour(me.id)) >= MAX_UPLOADS_PER_HOUR) return { error: "That's a lot of uploads. Try again in an hour." };

  try {
    const picture = await processPicture(kind.data, Buffer.from(await file.arrayBuffer()));
    await savePicture(me.id, kind.data, picture);
  } catch (err) {
    if (err instanceof NotAPicture) return { error: "That file isn't a picture we can use. Try JPG, PNG, WebP or GIF." };
    throw err;
  }
  await logActivity(me.id, "upload", `uploaded a new ${kind.data}`);
  refresh();
  return { ok: true };
}

export async function removePictureAction(form: FormData) {
  const me = await requireUser();
  await removePicture(me.id, Kind.parse(form.get("kind")));
  refresh();
}
