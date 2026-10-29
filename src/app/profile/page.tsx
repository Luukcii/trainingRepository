// "/profile" — edit your own player card, and see who you've blocked. Members only.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { requireUser } from "@/lib/session";
import { getCard } from "@/lib/profiles";
import { listBlocked } from "@/lib/blocks";
import { unblockAction } from "@/app/members/[userId]/actions";

export const metadata: Metadata = { title: "Your profile", robots: { index: false } };

export default function ProfilePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Your player card</h1>
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <ProfileArea />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function ProfileArea() {
  const me = await requireUser();
  const [card, blocked] = await Promise.all([getCard(me.id), listBlocked(me.id)]);
  if (!card) return null;

  return (
    <div className="flex flex-col gap-12">
      <ProfileEditor name={card.name} initial={card} />
      <Link href={`/members/${me.id}`} className="text-sm text-muted hover:text-foreground">
        See your profile as others see it →
      </Link>

      <section>
        <h2 className="mb-3 font-medium">Blocked members</h2>
        {blocked.length === 0 ? (
          <p className="text-sm text-muted">Nobody. Block someone from their profile page.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
            {blocked.map((b) => (
              <li key={b.id} className="flex items-center justify-between px-4 py-3">
                <span className="truncate">{b.name}</span>
                <form action={unblockAction}>
                  <input type="hidden" name="userId" value={b.id} />
                  <button type="submit" className="rounded-md border border-line px-3 py-1.5 text-sm">
                    Unblock
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
