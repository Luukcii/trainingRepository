"use client"; // signing out happens in the browser (it clears the login cookie)

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function WarSignOutButton() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/war");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} className="underline hover:text-stone-200">
      Sign out
    </button>
  );
}
