// Sends the bot's slash commands (src/lib/discord/commands.ts) to Discord for the HAFW server.
// Claude runs this: npm run discord:register. Needs DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID and
// DISCORD_GUILD_ID from .env.tools. The token is only used here, never printed, and never goes to Vercel.
import { commands } from "../src/lib/discord/commands";

const token = process.env.DISCORD_BOT_TOKEN;
const appId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.DISCORD_GUILD_ID;

const missing = Object.entries({ DISCORD_BOT_TOKEN: token, DISCORD_APPLICATION_ID: appId, DISCORD_GUILD_ID: guildId })
  .filter(([, value]) => !value)
  .map(([name]) => name);
if (missing.length) {
  console.error(`Missing in .env.tools: ${missing.join(", ")}`);
  process.exit(1);
}

async function main() {
  // Server ("guild") commands update instantly; global ones can take an hour.
  const res = await fetch(`https://discord.com/api/v10/applications/${appId}/guilds/${guildId}/commands`, {
    method: "PUT",
    headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });

  if (!res.ok) {
    // Discord's error body names the bad field; it never contains our token.
    console.error(`Discord said ${res.status}:`, (await res.text()).slice(0, 500));
    process.exit(1);
  }
  const saved = (await res.json()) as { name: string }[];
  console.log(`Registered: ${saved.map((c) => "/" + c.name).join(", ")}`);
}

main().catch((error) => {
  console.error("Couldn't reach Discord:", error instanceof Error ? error.message : "unknown error");
  process.exit(1);
});
