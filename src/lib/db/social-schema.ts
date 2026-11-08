// Profile walls and profile songs. Kept in their own file; schema.ts re-exports it so drizzle-kit sees these tables.
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./schema";

// A post on someone's wall. wallOwnerId = whose profile it's on; authorId = who wrote it.
export const wallPost = pgTable(
  "wall_post",
  {
    id: text("id").primaryKey(),
    wallOwnerId: text("wall_owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("wall_post_owner_idx").on(t.wallOwnerId, t.createdAt), index("wall_post_author_idx").on(t.authorId, t.createdAt)],
);

// A comment under a wall post. Deleting the post deletes its comments.
export const wallComment = pgTable(
  "wall_comment",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => wallPost.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("wall_comment_post_idx").on(t.postId, t.createdAt), index("wall_comment_author_idx").on(t.authorId, t.createdAt)],
);

// The song on a member's profile: only the 11-character YouTube video id, never the link they pasted.
export const profileSong = pgTable("profile_song", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  videoId: text("video_id").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
