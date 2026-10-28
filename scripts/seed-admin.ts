// Creates the admin account once. Signup is off on the website, so this is the only way in.
// The generated password is written to .admin-credentials.txt (git-ignored) — never printed.
//
// Usage: npm run seed:admin -- you@example.com "Your Name"
import { writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { betterAuth } from "better-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "../src/lib/auth-options";
import { db } from "../src/lib/db";
import { user } from "../src/lib/db/schema";

const [email, name = "Admin"] = process.argv.slice(2);
if (!email) {
  console.error("Usage: npm run seed:admin -- you@example.com \"Your Name\"");
  process.exit(1);
}

const password = randomBytes(18).toString("base64url");

// Same settings as the app, with signup switched on just for this script.
const seeder = betterAuth({
  ...authOptions,
  emailAndPassword: { ...authOptions.emailAndPassword, disableSignUp: false },
  rateLimit: { enabled: false },
});

async function main() {
  await seeder.api.signUpEmail({ body: { email, name, password } });
  // Signup can't set a role (input: false), so promote the new account directly.
  await db.update(user).set({ role: "admin" }).where(eq(user.email, email));
  writeFileSync(".admin-credentials.txt", `email: ${email}\npassword: ${password}\n`);
  console.log(`Admin created for ${email}. Credentials saved to .admin-credentials.txt`);
}

main().catch((err) => {
  // Print only the message: raw errors can contain connection strings.
  console.error("Seed failed:", String(err?.message ?? err).replace(/postgres\S*/g, "<redacted>"));
  process.exit(1);
});
