// "/war/rules/full" — the full technical rulebook. Static, like the player's guide.
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RulebookView } from "@/components/war/RulebookView";
import { techRules } from "@/content/war/tech-rules";

export const metadata: Metadata = { title: "Faction War — Full rulebook" };

export default function FullRulesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <RulebookView book={techRules} current="full" />
      </main>
      <SiteFooter />
    </>
  );
}
