"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { factionBySlug, factions } from "@/content/war/map";
import { chooseFaction } from "@/lib/war/accounts";
import { getWarUser } from "@/lib/session";

// Swear to a faction. Checked here, on the server: logged in, a war player, no faction yet.
export async function chooseFactionAction(form: FormData) {
  const me = await getWarUser();
  if (!me) redirect("/war/login");
  const slug = z.string().max(20).safeParse(form.get("faction"));
  const faction = slug.success ? factionBySlug(slug.data) : undefined;
  if (!faction) redirect("/war");
  await chooseFaction(me.id, faction); // does nothing if they already chose
  redirect(`/war/${factions[faction].slug}`);
}
