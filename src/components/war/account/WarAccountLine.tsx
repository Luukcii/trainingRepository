// One line on the war pages: who's logged in and their faction, or a link to log in. Reads the session,
// so it must sit inside <Suspense>.
import Link from "next/link";
import { factions, factionIds, type FactionId } from "@/content/war/map";
import { getWarUser } from "@/lib/session";
import { WarSignOutButton } from "./WarSignOutButton";

export async function WarAccountLine() {
  const me = await getWarUser();
  if (!me) {
    return (
      <p className="text-sm text-stone-400">
        Have an account? <Link href="/war/login" className="text-[#d4a017] underline">Log in</Link>
      </p>
    );
  }
  const faction = factionIds.includes(me.warFaction as FactionId) ? factions[me.warFaction as FactionId] : null;
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-3 text-sm text-stone-400">
      <span>
        Logged in as <span className="text-stone-200">{me.username ?? me.name}</span>
        {faction ? (
          <>
            {" · "}
            <Link href={`/war/${faction.slug}`} style={{ color: faction.color }} className="underline">
              {faction.people}
            </Link>
          </>
        ) : me.role === "admin" ? (
          " · staff"
        ) : me.role === "player" ? (
          " · no faction yet"
        ) : null}
      </span>
      <WarSignOutButton />
    </p>
  );
}
