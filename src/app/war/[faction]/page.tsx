// "/war/samurai", "/war/berserkrs", "/war/crusaders" — one faction's page. Who sees what is decided here,
// on the server, from the login session:
//   not logged in            → how to join, and a login link
//   a war player, no faction → swear to this faction (once)
//   this faction's player    → the kingdom's own numbers, land, Envoys and news
//   another faction's player → nothing of this faction's (fog of war)
//   staff (admin, mod, tech) → everything ("mod mode")
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WarNav } from "@/components/war/WarNav";
import { HowToJoin } from "@/components/war/account/HowToJoin";
import { FactionDashboard } from "@/components/war/FactionDashboard";
import { factionBySlug, factionIds, factions, type FactionId } from "@/content/war/map";
import { getWarUser } from "@/lib/session";
import { loadWarState } from "@/lib/war/state";
import { isWarStaffRole, roleTitle } from "@/lib/war/roles";
import { chooseFactionAction } from "./actions";

export const metadata: Metadata = { title: "Faction War — Faction", robots: { index: false } };

export function generateStaticParams() {
  return factionIds.map((f) => ({ faction: factions[f].slug }));
}

export default function FactionPage({ params }: PageProps<"/war/[faction]">) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <WarNav current="home" />
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <FactionBody params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function FactionBody({ params }: Pick<PageProps<"/war/[faction]">, "params">) {
  const { faction: slug } = await params;
  const f = factionBySlug(slug);
  if (!f) notFound();
  const me = await getWarUser();
  const sworn = factionIds.includes(me?.warFaction as FactionId) ? (me!.warFaction as FactionId) : null;

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-line p-5" style={{ borderTop: `6px solid ${factions[f].color}` }}>
        <h1 className="font-stone text-3xl">{factions[f].people}</h1>
        <p className="text-muted">
          The kingdom of {factions[f].name}. Heroes: {factions[f].heroes}.
        </p>
      </header>

      {!me ? (
        <section className="space-y-4">
          <p>Faction details are for its members. To join the {factions[f].people}:</p>
          <HowToJoin />
          <Link href={`/war/login?next=/war/${slug}`} className="inline-block rounded-md bg-foreground px-4 py-2 font-medium text-background">
            Log in
          </Link>
        </section>
      ) : isWarStaffRole(me.role) ? (
        <>
          <p className="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm">
            <strong>Mod mode</strong> ({roleTitle[me.role]}): you can see every faction. What you see here is secret from the
            other kingdoms.
          </p>
          <FactionDashboard faction={f} state={await loadWarState("all")} />
        </>
      ) : me.role !== "player" ? (
        <section className="space-y-4">
          <p>War accounts are made through Discord, so the bot can prove who you are:</p>
          <HowToJoin />
        </section>
      ) : !sworn ? (
        <section className="space-y-4">
          <p>
            Swear yourself to the <strong>{factions[f].people}</strong> of {factions[f].name}? You choose once. Changing later is a
            600-Gold faction swap through staff, and you&apos;d play for your new kingdom from the next quarter of the war.
          </p>
          <form action={chooseFactionAction}>
            <input type="hidden" name="faction" value={slug} />
            <button type="submit" className="rounded-md px-4 py-2 font-medium text-white" style={{ background: factions[f].color }}>
              Join the {factions[f].people}
            </button>
          </form>
          <p className="text-sm text-muted">
            Not sure? <Link href="/war" className="underline">Look at the other factions</Link> or read the{" "}
            <Link href="/war/rules" className="underline">player&apos;s guide</Link> first.
          </p>
        </section>
      ) : sworn !== f ? (
        <section className="space-y-3">
          <p>
            You&apos;re sworn to the{" "}
            <Link href={`/war/${factions[sworn].slug}`} className="underline" style={{ color: factions[sworn].color }}>
              {factions[sworn].people}
            </Link>
            . The {factions[f].people}&apos; details are secret; Vaelith may sell you what he knows.
          </p>
        </section>
      ) : (
        <FactionDashboard faction={f} state={await loadWarState(f)} />
      )}
    </div>
  );
}
