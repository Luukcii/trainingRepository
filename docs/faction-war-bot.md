# Faction war: connecting God, the Discord bot

The bot is called **God** (name it that in the Developer Portal). It lives inside the website. Everything God says is in `src/lib/discord/voice.ts`. Discord sends every `/war` and `/warstaff` command to
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

### Owner: God's free answers (`/war ask`, optional, costs money)

God answers free questions with Claude. That needs an API key from the Claude Console (console.anthropic.com),
billed per use. A Claude Pro/Max subscription doesn't cover it.

- Console → **Billing**: add credit and set a **monthly spend limit** (e.g. $5). That limit is the hard brake.
- Console → **API Keys** → create a key named `hafw-god`. Add it to Vercel (production, sensitive) as
  `ANTHROPIC_API_KEY`, and to `.env.local` to try it locally. Until then God says he doesn't answer free questions yet.
- Expected cost: God (Haiku) about 0.1¢ an answer, Odin (Opus) about 2–4¢. Limits: 5 questions an hour per player (30 for staff),
  200 a day in total. Mods see the last 24 hours' count and cost with `/warstaff mind`.

## 3. Claude: switch it on (next session on Max's computer)

1. Merge this work to `main` (deploys the pages and the bot endpoint).
2. ~~`npm run db:migrate`~~ Done 8 Nov: migrations 0007 (`war_*` tables) and 0008 (war accounts) are applied.
3. Add to Vercel (production) and `.env.local`: `DISCORD_PUBLIC_KEY`, `DISCORD_GUILD_ID`, optional `WAR_STAFF_ROLE_ID`. Redeploy.
4. ~~migration 0010 (`god_question`)~~ applied 8 Nov.
5. `npm run discord:register`: sends the command list to Discord. Run again after changing `src/lib/discord/commands.ts`.

## 4. Max: plug in the doorbell, start the war

1. Developer Portal → **General Information** → **Interactions Endpoint URL**:
   `https://training-repository-ten.vercel.app/api/discord/interactions` → **Save**.
   Discord rings it once to test; if it saves, it's connected.
2. In the HAFW server type `/warstaff setup`. Every kingdom starts with 75,000 Gold, all territories at Town Hall.
3. Open the war map: the yellow **Example data** badge is gone and it says **● Live**.

## Commands

| Command | Who | What it does |
|---|---|---|
| `/war join` | everyone | God makes your war account, tied to your Discord, and privately gives you a password + the sign-up page link |
| `/war password` | players | New password (private); the old one stops working and every device is logged out |
| `/war status [kingdom]` | your faction | Your kingdom's Gold, troops, Faith, Fame, Trade, AP (private reply; staff see all three) |
| `/war territory name` | everyone | Who holds it and its tier; troops, buildings and obstacles only if it's yours (private reply) |
| `/war moving` | your faction | Your kingdom's Envoys, Attacks and raids, plus Attacks on your land (private reply) |
| `/war log` | your faction | Your kingdom's news plus announcements and rulings (private reply) |
| `/war ask question` | everyone | God answers in his own words (or Odin, when the mods call him), from the rulebook only (only you see it). Off until the owner adds the AI key |
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
| `/warstaff ruling text` | staff | Posts a mods' ruling publicly in God's voice and keeps it in the war log (Claude copies it into the Hardset Register next session) |
| `/warstaff mind [god/odin/off]` | staff | Who answers `/war ask`: **God** (Haiku: quick, cheap, the default), **Odin** (Opus: the wise old wanderer, costs more) or nobody. Empty = show the setting and the last 24 hours' questions and cost |
| `/warstaff log` | staff | All news including secret entries (only you see it) |

**Fog of war (8 Nov):** the public (and the public map) see only who holds each territory and its tier. A player
sees their own kingdom's numbers, land, movements and news, on the site and in the bot; staff see everything.
Secret movements (ambushes by default, smuggled Envoys when `secret` is set) never leave the server at all.
Changes to a kingdom's numbers, troops, buildings and obstacles are confirmed only to the mod who made them.
Players link Discord through `/war join`, so God knows which kingdom each Discord account belongs to.

## Safety built in

- **Signature check**: every request must be signed by Discord, and less than 5 minutes old. Forged or replayed requests get 401.
- **One server only**: commands from any other server are refused, even if someone copies the bot.
- **Staff checked on our server**: Discord hides `/warstaff` from non-staff, and the site checks again. Staff = Discord admins / Manage Server, the `WAR_STAFF_ROLE_ID` role, or anyone Max made a Mod or Tech on `/admin`. A site Mod without Manage Server won't *see* `/warstaff` until Max allows it for them in Discord: Server Settings → Integrations → God → `/warstaff`.
- **No pings**: text typed into commands can't trigger `@everyone` when the bot repeats it.
- **Least privilege**: the website holds only the public key; the bot token stays in `.env.tools`.
- **God's free answers (`/war ask`)**: he reads only the public rulebook and glossary, never live war numbers, so he
  can't leak a kingdom's secrets. He has no tools, so he can't change anything. Answers are private to the asker, can't
  ping anyone, and end with "The mods' rulings outrank my words." He's told to send anything unsettled to the mods and never
  to guess. The question text isn't stored, only who asked, when, and the token counts (for limits and cost).
