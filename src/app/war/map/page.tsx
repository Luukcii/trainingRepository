// "/war/map" — the interactive war map. The frame is static; the war's numbers stream in on each visit.
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WarNav } from "@/components/war/WarNav";
import { WarMap } from "@/components/war/map/WarMap";
import { loadWarState } from "@/lib/war/state";
import { currentViewer } from "@/lib/war/viewer";
import { getWarUser } from "@/lib/session";
import { WarLoginRequired } from "@/components/war/account/WarLoginRequired";

export const metadata: Metadata = { title: "Faction War — Map" };

export default function WarMapPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <WarNav current="map" />
        <Suspense fallback={<p className="text-muted">Loading the war…</p>}>
          <LiveMap />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function LiveMap() {
  await connection(); // fresh numbers for every visitor, never a copy baked in at build time
  if (!(await getWarUser())) return <WarLoginRequired what="the war map" next="/war/map" />; // players only
  return <WarMap initial={await loadWarState(await currentViewer())} />;
}
