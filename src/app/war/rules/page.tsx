// "/war/rules" — the player's guide. Static: built once, served instantly to everyone.
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RulebookView } from "@/components/war/RulebookView";
import { playerRules } from "@/content/war/player-rules";

export const metadata: Metadata = { title: "Faction War — Player's guide" };

export default function PlayerRulesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <RulebookView book={playerRules} current="guide" />
      </main>
      <SiteFooter />
    </>
  );
}
