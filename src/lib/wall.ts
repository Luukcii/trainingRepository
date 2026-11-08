// Profile walls. Callers check canWrite() before adding; the delete functions check ownership themselves.
import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, gt, inArray, ne } from "drizzle-orm";
import { db } from "./db";
import { user } from "./db/schema";
import { wallComment, wallPost } from "./db/social-schema";
import { areFriends } from "./friends";
import { isBlocked } from "./blocks";
import { looksFor } from "./profiles";

// You can post and comment on your own wall and your friends' walls. A block shuts it either way.
export async function canWrite(me: string, wallOwnerId: string) {
  if (me === wallOwnerId) return true;
  if (await isBlocked(me, wallOwnerId)) return false;
  return areFriends(me, wallOwnerId);
}

// The newest posts on a wall, each with its comments (oldest first) and every author's name and emblem.
export async function listWall(wallOwnerId: string, limit = 30) {
  const posts = await db
    .select({ id: wallPost.id, authorId: wallPost.authorId, name: user.name, body: wallPost.body, createdAt: wallPost.createdAt })
    .from(wallPost)
    .innerJoin(user, eq(user.id, wallPost.authorId))
    .where(eq(wallPost.wallOwnerId, wallOwnerId))
    .orderBy(desc(wallPost.createdAt))
    .limit(limit);
  if (posts.length === 0) return [];

  const comments = await db
    .select({ id: wallComment.id, postId: wallComment.postId, authorId: wallComment.authorId, name: user.name, body: wallComment.body, createdAt: wallComment.createdAt })
    .from(wallComment)
    .innerJoin(user, eq(user.id, wallComment.authorId))
    .where(inArray(wallComment.postId, posts.map((p) => p.id)))
    .orderBy(asc(wallComment.createdAt));
  const looks = await looksFor([...new Set([...posts, ...comments].map((x) => x.authorId))]);

  return posts.map((p) => ({
    ...p,
    look: looks.get(p.authorId)!.look,
    comments: comments.filter((c) => c.postId === p.id).map((c) => ({ ...c, look: looks.get(c.authorId)!.look })),
  }));
}

export async function findPost(postId: string) {
  const [row] = await db.select().from(wallPost).where(eq(wallPost.id, postId)).limit(1);
  return row ?? null;
}

export async function addPost(wallOwnerId: string, authorId: string, body: string) {
  await db.insert(wallPost).values({ id: randomUUID(), wallOwnerId, authorId, body });
}

export async function addComment(postId: string, authorId: string, body: string) {
  await db.insert(wallComment).values({ id: randomUUID(), postId, authorId, body });
}

// The writer, the wall's owner, or the admin may delete. Returns whether anything was deleted.
export async function deletePost(me: { id: string; role: string }, postId: string) {
  const post = await findPost(postId);
  if (!post || (post.authorId !== me.id && post.wallOwnerId !== me.id && me.role !== "admin")) return false;
  await db.delete(wallPost).where(eq(wallPost.id, postId));
  return true;
}

export async function deleteComment(me: { id: string; role: string }, commentId: string) {
  const [row] = await db
    .select({ authorId: wallComment.authorId, wallOwnerId: wallPost.wallOwnerId })
    .from(wallComment)
    .innerJoin(wallPost, eq(wallPost.id, wallComment.postId))
    .where(eq(wallComment.id, commentId))
    .limit(1);
  if (!row || (row.authorId !== me.id && row.wallOwnerId !== me.id && me.role !== "admin")) return false;
  await db.delete(wallComment).where(eq(wallComment.id, commentId));
  return true;
}

// Posts + comments I wrote in the last N seconds (the flood limit).
export async function wroteSince(me: string, seconds: number) {
  const since = new Date(Date.now() - seconds * 1000);
  const [[posts], [comments]] = await Promise.all([
    db.select({ n: count() }).from(wallPost).where(and(eq(wallPost.authorId, me), gt(wallPost.createdAt, since))),
    db.select({ n: count() }).from(wallComment).where(and(eq(wallComment.authorId, me), gt(wallComment.createdAt, since))),
  ]);
  return posts.n + comments.n;
}

// Posts and comments others have put on my wall. The sidebar pops up when this number goes up.
export async function othersActivityOnMyWall(me: string) {
  const [[posts], [comments]] = await Promise.all([
    db.select({ n: count() }).from(wallPost).where(and(eq(wallPost.wallOwnerId, me), ne(wallPost.authorId, me))),
    db
      .select({ n: count() })
      .from(wallComment)
      .innerJoin(wallPost, eq(wallPost.id, wallComment.postId))
      .where(and(eq(wallPost.wallOwnerId, me), ne(wallComment.authorId, me))),
  ]);
  return posts.n + comments.n;
}
