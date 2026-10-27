// One shared database client for the whole app.
// DATABASE_URL logs in as app_user: it can read/write rows but can't change or drop tables.
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
