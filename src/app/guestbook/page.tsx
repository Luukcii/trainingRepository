// "/guestbook" — anyone can read; members can sign. The heading prerenders; posts and the form stream in.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { GuestbookForm } from "@/components/guestbook/GuestbookForm";
import { GuestbookEntries } from "@/components/guestbook/GuestbookEntries";
import { getUser } from "@/lib/session";

export const metadata: Metadata = { title: "Guestbook" };

export default function GuestbookPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Guestbook</h1>
        <Suspense fallback={<p className="text-muted">Loading messages…</p>}>
          <Guestbook />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function Guestbook() {
  const user = await getUser();

  return (
    <>
      <div className="mb-10">
        {user ? (
          <>
            <GuestbookForm name={user.name} />
            <div className="mt-3 text-xs text-muted">
              <SignOutButton />
            </div>
          </>
        ) : (
          <p className="text-muted">
            <Link href="/login" className="underline hover:text-foreground">Log in</Link> to sign the guestbook. Accounts are invite-only.
          </p>
        )}
      </div>
      <GuestbookEntries canDelete={user?.role === "admin"} />
    </>
  );
}
