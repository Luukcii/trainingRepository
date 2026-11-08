// Auth settings shared by the app and the seed script.
import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import { logActivity } from "./activity";

function redact(text: string) {
  return text
    .replace(/params:[^\n]*/gi, "params: <redacted>")
    .replace(/postgres(ql)?:\/\/\S*/g, "<redacted>")
    .slice(0, 500);
}

export const authOptions = {
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // nobody can register from the website
    minPasswordLength: 12,
  },
  user: {
    // input: false → a signup request can't set these. Only the database (or our own server code) can:
    // the role (admin / member / player), the Discord account the bot proved, and the chosen faction.
    additionalFields: {
      role: { type: "string", defaultValue: "member", input: false },
      discordId: { type: "string", required: false, input: false },
      warFaction: { type: "string", required: false, input: false },
    },
  },
  // Faction-war players log in with their Discord username. Discord usernames are 2–32 characters:
  // lowercase letters, numbers, "_" and ".". Immutable: nobody can rename themselves into someone else.
  plugins: [
    username({
      minUsernameLength: 2,
      maxUsernameLength: 32,
      usernameValidator: (name) => /^[a-z0-9_.]+$/.test(name),
      immutableUsername: true,
    }),
  ],
  // Switch off built-in endpoints the site doesn't use. "/update-user" would let anyone rename themselves
  // (impersonation); "/is-username-available" would let strangers probe which Discord names have accounts.
  disabledPaths: ["/update-user", "/is-username-available", "/change-email", "/delete-user"],
  // Auth errors go to Vercel's logs. Database errors include the query's values (session tokens!),
  // so print only a cleaned-up message: no query values, no connection strings.
  logger: {
    log: (level, message, ...args) => {
      const detail = args.map((a) => redact(String(a?.message ?? a))).join(" ");
      console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](`[auth] ${level}: ${redact(message)} ${detail}`.trim());
    },
  },
  // A new session row means someone just logged in: note it in the activity logbook.
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          await logActivity(session.userId, "signed_in", "signed in").catch(() => {}); // never block a login over a log line
        },
      },
    },
  },
  // Limit login attempts. Stored in the database so it holds across Vercel's many servers.
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "rateLimit",
    customRules: { "/sign-in/email": { window: 60, max: 5 }, "/sign-in/username": { window: 60, max: 5 } },
  },
} satisfies BetterAuthOptions;
