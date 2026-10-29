// Database tables, defined in code. Drizzle turns these into SQL migrations.
// The first four are the tables Better Auth needs; rateLimit stores login-attempt counts.
// invite holds Max's sign-up links. The rest hold what members do: posts, reviews, friends, messages, profiles, blocks.
import { sql } from "drizzle-orm";
import { pgTable, text, boolean, timestamp, integer, bigint, index, uniqueIndex, check, customType } from "drizzle-orm/pg-core";

// Raw bytes (for pictures). Sent to Postgres in its hex form, read back into a Buffer.
const bytea = customType<{ data: Buffer; driverData: string | Uint8Array }>({
  dataType: () => "bytea",
  toDriver: (value) => "\\x" + value.toString("hex"),
  fromDriver: (value) => (typeof value === "string" ? Buffer.from(value.replace(/^\\x/, ""), "hex") : Buffer.from(value)),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("member"), // "admin" opens /admin; everyone else is "member"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"), // a hash, never the real password
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

// One row per invite link. We store a hash of the token, like a password: a leaked table can't be used to sign up.
export const invite = pgTable("invite", {
  id: text("id").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  usedBy: text("used_by").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const guestbookEntry = pgTable(
  "guestbook_entry",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("guestbook_entry_created_at_idx").on(t.createdAt)],
);

// A logbook: one row per thing a member does. The admin activity box reads it, newest first.
export const activity = pgTable(
  "activity",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // e.g. "signed_in", "guestbook_post"
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("activity_created_at_idx").on(t.createdAt)],
);

// One review per member per project. approval is 0–100 (%); the database itself refuses anything else.
export const review = pgTable(
  "review",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectSlug: text("project_slug").notNull(),
    approval: integer("approval").notNull(),
    comment: text("comment").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("review_user_project_idx").on(t.userId, t.projectSlug),
    index("review_project_idx").on(t.projectSlug),
    check("review_approval_range", sql`${t.approval} BETWEEN 0 AND 100`),
  ],
);

// A friend request; status becomes "accepted" when the other person says yes. One row per pair.
export const friendship = pgTable(
  "friendship",
  {
    id: text("id").primaryKey(),
    requesterId: text("requester_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    addresseeId: text("addressee_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"), // "pending" | "accepted"
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("friendship_pair_idx").on(t.requesterId, t.addresseeId),
    index("friendship_addressee_idx").on(t.addresseeId),
    check("friendship_not_self", sql`${t.requesterId} <> ${t.addresseeId}`),
  ],
);

// A direct message between two members. readAt stays empty until the receiver opens the chat.
export const message = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    fromId: text("from_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    toId: text("to_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    readAt: timestamp("read_at"),
  },
  (t) => [
    index("message_pair_idx").on(t.fromId, t.toId, t.createdAt),
    index("message_unread_idx").on(t.toId, t.readAt),
  ],
);

// When each member's browser last said "still here". Recent = online.
export const presence = pgTable("presence", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  lastSeenAt: timestamp("last_seen_at").notNull(),
});

// A member's uploaded picture, already re-drawn by our server as a small WebP. One per member per kind.
export const upload = pgTable(
  "upload",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(), // "emblem" | "banner"
    data: bytea("data").notNull(),
    size: integer("size").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("upload_user_kind_idx").on(t.userId, t.kind)],
);

// Each member's player card. banner/emblem/color are keys from src/content/player-card.ts, never raw CSS.
// An uploaded picture, when set, replaces the preset banner or emblem.
export const profile = pgTable("profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  callsign: text("callsign").notNull().default(""),
  bio: text("bio").notNull().default(""),
  banner: text("banner").notNull().default("stone"),
  emblem: text("emblem").notNull().default("shield"),
  color: text("color").notNull().default("gold"),
  emblemUploadId: text("emblem_upload_id").references(() => upload.id, { onDelete: "set null" }),
  bannerUploadId: text("banner_upload_id").references(() => upload.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// blockerId doesn't want contact with blockedId: no requests, no messages, hidden from each other.
export const block = pgTable(
  "block",
  {
    blockerId: text("blocker_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    blockedId: text("blocked_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("block_pair_idx").on(t.blockerId, t.blockedId),
    index("block_blocked_idx").on(t.blockedId),
    check("block_not_self", sql`${t.blockerId} <> ${t.blockedId}`),
  ],
);
