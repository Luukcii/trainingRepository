// A second auth instance with signup switched on. Only the join Server Action uses it,
// and only after an invite link has been claimed. The public /api/auth handler keeps signup off.
import { betterAuth } from "better-auth";
import { authOptions } from "./auth-options";

export const signupAuth = betterAuth({
  ...authOptions,
  emailAndPassword: { ...authOptions.emailAndPassword, disableSignUp: false, autoSignIn: false },
});
