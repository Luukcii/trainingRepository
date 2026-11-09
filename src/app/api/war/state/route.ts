// GET /api/war/state — the war as this visitor may see it (their own kingdom, or the public map). The map asks again every 30 seconds,
// so new Envoys and Attacks recorded by the Discord bot appear without a reload.
import { connection } from "next/server";
import { loadWarState } from "@/lib/war/state";
import { currentViewer } from "@/lib/war/viewer";
import { getWarUser } from "@/lib/session";

export async function GET() {
  await connection(); // answer each request fresh; never bake a copy in at build time
  // Players only, like the map page: without this, anyone could skip the page and read the data here directly.
  if (!(await getWarUser())) return Response.json({ error: "Log in first" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const state = await loadWarState(await currentViewer());
  return Response.json(state, { headers: { "Cache-Control": "private, no-store" } });
}
