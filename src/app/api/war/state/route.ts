// GET /api/war/state — the war as the public map sees it. The map asks again every 30 seconds,
// so new Envoys and Attacks recorded by the Discord bot appear without a reload.
import { connection } from "next/server";
import { loadWarState } from "@/lib/war/state";

export async function GET() {
  await connection(); // answer each request fresh; never bake a copy in at build time
  const state = await loadWarState();
  return Response.json(state, { headers: { "Cache-Control": "no-store" } });
}
