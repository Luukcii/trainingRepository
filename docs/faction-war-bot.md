# Faction war: connecting the Discord bot

The bot lives inside the website. Discord sends every `/war` and `/warstaff` command to
`https://training-repository-ten.vercel.app/api/discord/interactions`; the site checks Discord's signature,
updates the war in the database, and replies. The war map reads the same database, so anything staff record
in Discord shows up on the map within 30 seconds.

```
Discord ──signed command──▶ /api/discord/interactions ──▶ Neon (war_* tables) ◀── /war/map (every 30 s)
```

Four people-steps, in this order. Nothing here needs Max to touch a password or token.

## 1. Max: create the bot in Discord (10 minutes, no secrets)

1. Open <https://discord.com/developers/applications> and sign in with your Discord account.
2. Click **New Application**, name it `HAFW War Bot`, tick the box, **Create**.
3. On **General Information**, copy the **Application ID** and the **Public Key** and send both to Claude in chat.
   They are not secrets: the public key is made to be shared.
4. Go to **Installation**, set **Install Link** to **None**, save. Then go to **Bot** and switch **Public Bot** off, save.
   This stops strangers adding your bot to their servers.
5. Go to **OAuth2 → URL Generator**. Tick only **applications.commands**. Open the link it makes, pick the HAFW
   server, **Authorize**. (No other permissions: the bot only answers commands, so it doesn't need any.)
6. In the Discord app: **User Settings → Advanced → Developer Mode** on. Right-click the HAFW server icon →
   **Copy Server ID**. Send it to Claude.
7. Optional: make a role called `War Staff` for the people who keep the record. Right-click it in
   **Server Settings → Roles** → **Copy Role ID**, send it to Claude. Without it, anyone with *Manage Server* is staff.

## 2. Owner: the bot token (Max skips this)

The bot token is a password for the bot. Only the command-registration script uses it.

- In the Developer Portal → **Bot** → **Reset Token**, put it in `.env.tools` as `DISCORD_BOT_TOKEN`,
  plus `DISCORD_APPLICATION_ID` and `DISCORD_GUILD_ID`.
- It never goes into Vercel or `.env.local`: the website only needs the public key.

## 3. Claude: switch it on (next session on Max's computer)

1. Merge this work to `main` (deploys the pages and the bot endpoint).
2. `npm run db:migrate`: creates the five `war_*` tables (new tables only, nothing existing changes).
3. Add to Vercel (production) and `.env.local`: `DISCORD_PUBLIC_KEY`, `DISCORD_GUILD_ID`, optional `WAR_STAFF_ROLE_ID`. Redeploy.
4. `npm run discord:register`: sends the command list to Discord. Run again after changing `src/lib/discord/commands.ts`.

## 4. Max: plug in the doorbell, start the war

1. Developer Portal → **General Information** → **Interactions Endpoint URL**:
   `https://training-repository-ten.vercel.app/api/discord/interactions` → **Save**.
   Discord rings it once to test; if it saves, it's connected.
2. In the HAFW server type `/warstaff setup`. Every kingdom starts with 75,000 Gold, all territories at Town Hall.
3. Open the war map: the yellow **Example data** badge is gone and it says **● Live**.

## Commands

| Command | Who | What it does |
|---|---|---|
| `/war status [kingdom]` | everyone | Gold, troops, Faith, Fame, Trade, AP, territories |
| `/war territory name` | everyone | Who holds it, tier, troops, buildings, obstacles |
| `/war moving` | everyone | Public Envoys, Attacks, raids on the move |
| `/war log` | everyone | Latest public news |
| `/war rule term` | everyone | Explains a rule (only you see it) |
| `/war map` | everyone | Links to the map and rulebooks |
| `/warstaff setup` | staff | Starts the war (refuses if one exists) |
| `/warstaff day number` | staff | Sets the war day |
| `/warstaff adjust kingdom stat amount [reason]` | staff | Adds or takes away Gold, troops, Faith… |
| `/warstaff set kingdom stat value [reason]` | staff | Sets a number exactly |
| `/warstaff territory name [kingdom] [tier] [troops]` | staff | New holder, tier or troops |
| `/warstaff building name building [add/remove]` | staff | Buildings on a territory |
| `/warstaff obstacle name obstacle [place/clear]` | staff | Obstacles on a territory |
| `/warstaff envoy·attack·ambush·raid kingdom from to [hours] [troops] [cargo] [secret]` | staff | Starts a movement; replies with a 5-letter code |
| `/warstaff resolve id outcome [capture] [note]` | staff | Arrived / won / lost / called off; `capture` hands a won Attack's target over |
| `/warstaff reveal id` | staff | Puts a secret movement on the public map |
| `/warstaff log` | staff | All news including secret entries (only you see it) |

Secret movements (ambushes by default, smuggled Envoys when `secret` is set) never reach the public map or
`/war log`. A won or lost battle becomes public automatically.

## Safety built in

- **Signature check**: every request must be signed by Discord, and less than 5 minutes old. Forged or replayed requests get 401.
- **One server only**: commands from any other server are refused, even if someone copies the bot.
- **Staff checked on our server**: Discord hides `/warstaff` from non-staff, and the site checks again.
- **No pings**: text typed into commands can't trigger `@everyone` when the bot repeats it.
- **Least privilege**: the website holds only the public key; the bot token stays in `.env.tools`.
