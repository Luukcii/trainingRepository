// GET /api/images/<id> — a member's uploaded picture. Members only, like profiles.
import { z } from "zod";
import { getUser } from "@/lib/session";
import { getPicture } from "@/lib/uploads";

export async function GET(_request: Request, { params }: RouteContext<"/api/images/[id]">) {
  const id = z.uuid().safeParse((await params).id);
  if (!id.success || !(await getUser())) return new Response("Not found", { status: 404 });

  const data = await getPicture(id.data);
  if (!data) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/webp", // always WebP: we made it ourselves
      // The picture at this URL never changes (a new upload gets a new URL), so the browser can keep it.
      // "private": only this person's browser, never a shared cache.
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
