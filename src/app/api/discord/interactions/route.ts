// POST /api/discord/interactions — Discord's doorbell. Every slash command typed in the server arrives
// here as a signed request. We check the signature first; anything unsigned is turned away.
import { verifyDiscordRequest } from "@/lib/discord/verify";
import { handleInteraction, PING, type Interaction } from "@/lib/discord/handle";

export async function POST(request: Request) {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey || !process.env.DISCORD_GUILD_ID) {
    return new Response("Discord bot not configured", { status: 503 });
  }

  const body = await request.text();
  if (body.length > 64_000) return new Response("Too large", { status: 413 });
  const ok = verifyDiscordRequest(body, request.headers.get("x-signature-ed25519"), request.headers.get("x-signature-timestamp"), publicKey);
  if (!ok) return new Response("Bad signature", { status: 401 });

  let interaction: Interaction;
  try {
    interaction = JSON.parse(body);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // Discord checks the doorbell works by sending a PING when the URL is saved in the Developer Portal.
  if (interaction.type === PING) return Response.json({ type: 1 });

  return Response.json(await handleInteraction(interaction));
}
