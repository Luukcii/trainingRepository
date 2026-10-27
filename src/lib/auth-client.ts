// Browser-side auth helpers (sign in, sign out). Holds no secrets.
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
