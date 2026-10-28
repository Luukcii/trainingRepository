// "/join/<token>" — where an invite link lands. The link itself is the permission to sign up.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { isInviteUsable } from "@/lib/invites";
import { JoinForm } from "@/components/auth/JoinForm";

export const metadata: Metadata = { title: "Join", robots: { index: false } };

export default function JoinPage({ params }: PageProps<"/join/[token]">) {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Join Max&apos;s site</h1>
        <Suspense fallback={<p className="text-muted">Checking your invite…</p>}>
          <InviteCheck params={params} />
        </Suspense>
        <Link href="/" className="mt-6 block text-sm text-muted hover:text-foreground">
          ← Back to site
        </Link>
      </div>
    </main>
  );
}

async function InviteCheck({ params }: Pick<PageProps<"/join/[token]">, "params">) {
  const { token } = await params;
  if (!(await isInviteUsable(token))) {
    return <p className="text-muted">This invite link is used up or expired. Ask Max for a new one.</p>;
  }
  return <JoinForm token={token} />;
}
