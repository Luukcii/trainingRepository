// Server-side auth. Reads BETTER_AUTH_SECRET and BETTER_AUTH_URL from env.
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { authOptions } from "./auth-options";

export const auth = betterAuth({
  ...authOptions,
  plugins: [nextCookies()],
});
