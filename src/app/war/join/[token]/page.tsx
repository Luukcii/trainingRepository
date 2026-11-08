// "/war/join/<token>" — the private sign-up link the Discord bot sends after /war join.
// The token proves which Discord account asked for it; here the player only chooses a password.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WarJoinForm } from "@/components/war/account/WarJoinForm";
import { readJoinLink } from "@/lib/war/accounts";

export const metadata: Metadata = { title: "Faction War — Make your account", robots: { index: false } };

export default function WarJoinPage({ params }: PageProps<"/war/join/[token]">) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Make your war account</h1>
        <Suspense fallback={<p className="text-muted">Checking your link…</p>}>
          <JoinBody params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function JoinBody({ params }: Pick<PageProps<"/war/join/[token]">, "params">) {
  const { token } = await params;
  const link = token.length <= 100 ? await readJoinLink(token) : null;
  if (!link) {
    return (
      <p className="text-muted">
        This link is used up or expired (links last 30 minutes). Type <code className="rounded bg-line px-1.5 py-0.5">/war join</code> in
        the HAFW Discord for a new one, or <Link href="/war/login" className="underline">log in</Link> if you already have an account.
      </p>
    );
  }
  return (
    <div className="space-y-6">
      <p>
        Discord account: <strong>{link.discordUsername}</strong>
        {link.displayName !== link.discordUsername && <span className="text-muted"> ({link.displayName})</span>}. You&apos;ll log in
        with this name and the password you choose now.
      </p>
      <WarJoinForm token={token} />
    </div>
  );
}
