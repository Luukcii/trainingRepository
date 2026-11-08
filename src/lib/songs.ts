// Profile songs. Members paste any YouTube link; we keep only the video id and build the player link ourselves.
import { eq } from "drizzle-orm";
import { db } from "./db";
import { profileSong } from "./db/social-schema";

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com"]);

// "https://youtu.be/abc…?si=…", "youtube.com/watch?v=abc…&list=…", "/shorts/abc…" or a bare id → "abc…". Anything else → null.
export function parseYouTubeId(input: string): string | null {
  const text = input.trim();
  if (VIDEO_ID.test(text)) return text;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;
  const parts = url.pathname.split("/").filter(Boolean);
  const candidate =
    url.hostname === "youtu.be" ? parts[0] : parts[0] === "watch" || parts.length === 0 ? url.searchParams.get("v") : parts[1]; // /shorts/<id>, /embed/<id>, /live/<id>
  return candidate && VIDEO_ID.test(candidate) ? candidate : null;
}

export async function getSong(userId: string) {
  const [row] = await db.select({ videoId: profileSong.videoId }).from(profileSong).where(eq(profileSong.userId, userId)).limit(1);
  return row?.videoId ?? null;
}

export async function setSong(userId: string, videoId: string) {
  const values = { videoId, updatedAt: new Date() };
  await db.insert(profileSong).values({ userId, ...values }).onConflictDoUpdate({ target: profileSong.userId, set: values });
}

export async function removeSong(userId: string) {
  await db.delete(profileSong).where(eq(profileSong.userId, userId));
}
