// Tells drizzle-kit where the schema lives and which database to migrate.
// Migrations need the owner login (DATABASE_ADMIN_URL), which lives only in .env.tools — never in the app.
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.tools", quiet: true });

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_ADMIN_URL! },
});
