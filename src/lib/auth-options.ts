// Auth settings shared by the app and the seed script.
import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const authOptions = {
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // nobody can register from the website
    minPasswordLength: 12,
  },
  user: {
    // input: false → a signup request can't choose its own role. Only the database (or Claude) can make an admin.
    additionalFields: { role: { type: "string", defaultValue: "member", input: false } },
  },
  // Limit login attempts. Stored in the database so it holds across Vercel's many servers.
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "rateLimit",
    customRules: { "/sign-in/email": { window: 60, max: 5 } },
  },
} satisfies BetterAuthOptions;
