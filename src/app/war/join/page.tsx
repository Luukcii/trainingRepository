// "/war/join" — the sign-up page God links to after /war join. The player enters their Discord username
// and the password God gave them, and may choose their own password on the way in.
// Also works later as "change my password" (current password instead of God's).
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WarNav } from "@/components/war/WarNav";
import { WarJoinForm } from "@/components/war/account/WarJoinForm";

export const metadata: Metadata = { title: "Faction War — Sign up", robots: { index: false } };

export default function WarJoinPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
        <WarNav current="home" />
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Sign up for the war</h1>
        <p className="mb-6 text-sm text-muted">
          No password yet? Type <code className="rounded bg-line px-1.5 py-0.5">/war join</code> in the HAFW Discord and God
          will give you one. Already set up? <Link href="/war/login" className="underline">Log in</Link>.
        </p>
        <WarJoinForm />
      </main>
      <SiteFooter />
    </>
  );
}
