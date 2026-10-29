// Member pictures. We never keep the file someone sent: sharp re-draws it as a small WebP,
// which drops anything hidden inside (scripts, GPS location) and caps its size.
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { and, count, eq, gt } from "drizzle-orm";
import { db } from "./db";
import { activity, profile, upload } from "./db/schema";

export type PictureKind = "emblem" | "banner";

export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const SIZES = { emblem: { width: 256, height: 256 }, banner: { width: 1024, height: 256 } };
// Checked from the file's contents, not its name: "virus.exe" renamed "cat.png" is still refused.
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "gif"]);

export class NotAPicture extends Error {}

export async function processPicture(kind: PictureKind, bytes: Buffer) {
  const image = sharp(bytes, { limitInputPixels: 40_000_000 }); // refuses "decompression bombs"
  const meta = await image.metadata().catch(() => null);
  if (!meta?.format || !ALLOWED_FORMATS.has(meta.format)) throw new NotAPicture();
  return image
    .rotate() // turn phone photos upright before the orientation data is dropped
    .resize({ ...SIZES[kind], fit: "cover" })
    .webp({ quality: 82 })
    .toBuffer()
    .catch(() => {
      throw new NotAPicture(); // e.g. a damaged file that only looked like a picture at first
    });
}

// Replace this member's picture of this kind. A new id each time means a new URL, so browsers never show a stale copy.
export async function savePicture(userId: string, kind: PictureKind, data: Buffer) {
  const id = randomUUID();
  await db.delete(upload).where(and(eq(upload.userId, userId), eq(upload.kind, kind)));
  await db.insert(upload).values({ id, userId, kind, data, size: data.length });
  const column = kind === "emblem" ? { emblemUploadId: id } : { bannerUploadId: id };
  await db.insert(profile).values({ userId, ...column }).onConflictDoUpdate({ target: profile.userId, set: column });
}

// Deleting the row also empties the profile's link to it (the database does that: "on delete set null").
export async function removePicture(userId: string, kind?: PictureKind) {
  await db.delete(upload).where(and(eq(upload.userId, userId), kind ? eq(upload.kind, kind) : undefined));
}

export async function getPicture(id: string) {
  const [row] = await db.select({ data: upload.data }).from(upload).where(eq(upload.id, id)).limit(1);
  return row?.data ?? null;
}

export async function uploadsLastHour(userId: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const [row] = await db
    .select({ n: count() })
    .from(activity)
    .where(and(eq(activity.userId, userId), eq(activity.type, "upload"), gt(activity.createdAt, since)));
  return row.n;
}
