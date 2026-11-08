// "/war" — the Faction War front page: Max's hand-lettered title, then one button per faction.
// The page is static (instant for everyone); only the small "who's logged in" line streams in.
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GothicTitle } from "@/components/war/title/GothicTitle";
import { OrnamentDivider } from "@/components/war/title/OrnamentDivider";
import { WarAccountLine } from "@/components/war/account/WarAccountLine";
import { factions, type FactionId } from "@/content/war/map";

export const metadata: Metadata = { title: "Faction War", description: "Choose your faction. Hold your ground." };

// Max's order: Samurai, Berserkrs, Crusaders.
const buttons: FactionId[] = ["kogahara", "valdyruus", "svaroth"];

export default function WarHomePage() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden bg-[radial-gradient(ellipse_at_center,#292524_0%,#0c0a09_70%)] px-6 py-24 text-center text-stone-200">
        <h1 className="w-full max-w-4xl">
          {/* The title is a drawing, so screen readers and search engines get the words from this hidden text */}
          <span className="sr-only">Faction War</span>
          <GothicTitle className="w-full drop-shadow-[0_4px_12px_rgb(212_160_23/0.35)]" />
        </h1>
        <OrnamentDivider className="w-72 sm:w-96" />
        <p className="max-w-md text-lg text-stone-400">Choose your faction. Hold your ground.</p>

        <nav aria-label="Factions" className="flex w-full max-w-3xl flex-col gap-4 sm:flex-row">
          {buttons.map((f) => (
            <Link
              key={f}
              href={`/war/${factions[f].slug}`}
              className="group flex-1 rounded-lg border border-[#d4a017]/60 bg-black/40 px-6 py-5 font-stone text-2xl tracking-wide text-stone-100 transition hover:border-[#d4a017] hover:bg-black/60"
              style={{ boxShadow: `inset 0 -4px 0 ${factions[f].color}` }}
            >
              {factions[f].people}
              <span className="mt-1 block font-sans text-xs uppercase tracking-[0.25em] text-stone-400 group-hover:text-stone-300">
                {factions[f].name}
              </span>
            </Link>
          ))}
        </nav>

        <Suspense fallback={<p className="h-5 text-sm text-stone-500" />}>
          <WarAccountLine />
        </Suspense>

        <nav aria-label="Faction war pages" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-stone-400">
          <Link href="/war/rules" className="hover:text-[#d4a017]">Player&apos;s guide</Link>
          <Link href="/war/rules/full" className="hover:text-[#d4a017]">Full rulebook</Link>
          <Link href="/war/map" className="hover:text-[#d4a017]">War map</Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
