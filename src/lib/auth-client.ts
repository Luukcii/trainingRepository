// Browser-side auth helpers (sign in, sign out). Holds no secrets.
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth"; // type only: teaches the browser that users have a role; no server code ships

export const authClient = createAuthClient({ plugins: [inferAdditionalFields<typeof auth>()] });
