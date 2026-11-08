// GET /api/war/state — the war as this visitor may see it (their own kingdom, or the public map). The map asks again every 30 seconds,
// so new Envoys and Attacks recorded by the Discord bot appear without a reload.
import { connection } from "next/server";
import { loadWarState } from "@/lib/war/state";
import { currentViewer } from "@/lib/war/viewer";

export async function GET() {
  await connection(); // answer each request fresh; never bake a copy in at build time
  const state = await loadWarState(await currentViewer());
  return Response.json(state, { headers: { "Cache-Control": "private, no-store" } });
}
