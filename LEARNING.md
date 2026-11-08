# Max's Learning Log

The project's memory of what Max knows. Claude reads this at the start of every session and updates it as concepts land.

**This is a tracker, not a syllabus.** Max leads: he builds what he wants, and concepts get taught when the work touches them. Any order is fine. Use this file to know what he already has, what to reinforce, and what's new.

## Status key
| Status | Meaning |
|---|---|
| `—` | Not introduced yet |
| `intro` | Explained once |
| `practicing` | Has used it with help |
| `understood` | Explained it back or applied it unprompted (record the date) |
| `review` | Was understood, then stumbled. Reteach from a new angle |

---

## How Max learns
*Notes on what works for him: analogies that clicked, pace, what to avoid. Fill in as we go.*

- Visual and design-driven: directs by describing what he sees ("smush it", "slightly behind the a"). Iterate by showing, not explaining.
- Picks up vocabulary fast and reuses it: "kerning" one message after hearing it. Also coins his own names ("the woven" for the gold vines); map them to the real term (filigree) rather than correcting.

---

## Concepts

### 0. Tools & the console
| Concept | Status | Date | Notes |
|---|---|---|---|
| What a terminal/console is | — | | |
| Running a command; reading output | — | | |
| Folders & paths (`cd`, current directory) | intro | 2026-11-05 | Drawers-in-drawers analogy; found Github folder in File Explorer himself. Typed first `cd` into a browser search, then found the VS Code terminal via the menu |
| PATH (how the terminal finds programs) | — | | |
| Node.js (JavaScript outside the browser) | — | | |
| npm & `package.json` (dependencies, scripts) | — | | |
| `npm run dev` / stopping with Ctrl+C | — | | |
| Reading an error message | — | | |

### 1. How the web works
| Concept | Status | Date | Notes |
|---|---|---|---|
| Client vs server | — | | |
| Request & response | — | | |
| localhost vs a deployed site | — | | |
| HTML, CSS, JavaScript: what each does | — | | |

### 2. Site structure
| Concept | Status | Date | Notes |
|---|---|---|---|
| Project folders & what lives where | — | | |
| Routes: folder = URL (App Router) | — | | |
| Layouts (shared shell: header/footer) | — | | |
| One-page site & anchor navigation | — | | |

### 3. Compartmentalization
| Concept | Status | Date | Notes |
|---|---|---|---|
| Components (one job each) | — | | |
| Props (passing data in) | — | | |
| Server vs Client Components | — | | |
| Separating UI, logic, and data | — | | |

### 4. Styling
| Concept | Status | Date | Notes |
|---|---|---|---|
| Box model (margin, border, padding) | — | | |
| Flexbox & grid (layout) | — | | |
| Tailwind utility classes | — | | |
| Responsive design (mobile first) | — | | |
| Design consistency (spacing, color, type scale) | — | | |
| SVG (drawing with coordinates) | intro | 2026-11-05 | Faction War title is hand-drawn SVG: pen moves as x/y points |
| Tracking (spacing all letters) | intro | 2026-11-05 | "Smush it closer together" → negative tracking |
| Kerning (spacing one letter pair) | understood | 2026-11-06 | Used it unprompted, one message after first hearing it: "the kerning of the F closer to the a" |
| Paint order (drawn later = on top) | intro | 2026-11-06 | Asked for the F's vines "slightly behind the a"; layers-of-paper analogy |

### 5. UI surfaces
| Concept | Status | Date | Notes |
|---|---|---|---|
| Header, menu, footer as page regions | — | | |
| Sections & content hierarchy | — | | |
| Accessibility basics (semantic HTML, alt text, contrast) | — | | |

### 6. Control surfaces
| Concept | Status | Date | Notes |
|---|---|---|---|
| Public site vs admin area | — | | |
| Forms & inputs | — | | |
| Server Actions (form → server) | — | | |
| Dashboards & panels (admin layout) | — | | |

### 7. Security
| Concept | Status | Date | Notes |
|---|---|---|---|
| Secrets & env vars (why `.env` is never committed) | — | | |
| Public vs server-only code (`NEXT_PUBLIC_`) | — | | |
| Authentication vs authorization | — | | |
| Password hashing | — | | |
| Sessions & cookies | — | | |
| Server-side auth checks (don't trust the browser) | — | | |
| Input validation | — | | |
| SQL injection & parameterized queries | — | | |
| Least privilege | — | | |

### 8. Efficiency
| Concept | Status | Date | Notes |
|---|---|---|---|
| Ship less JavaScript (server-first) | — | | |
| Images & fonts optimization | — | | |
| Few dependencies, on purpose | — | | |
| Build step: what it does and why | — | | |

### 9. Data
| Concept | Status | Date | Notes |
|---|---|---|---|
| What a database is (tables, rows, columns) | — | | |
| Neon / Postgres | — | | |
| ORM & schema (Drizzle) | — | | |
| Migrations | — | | |

### 10. Git & deployment
| Concept | Status | Date | Notes |
|---|---|---|---|
| Git: commits as save points | — | | |
| Branches | — | | |
| GitHub & pushing | — | | |
| Pull requests | — | | |
| Vercel: preview vs production | — | | |
| Env vars in production | — | | |

### 11. Later
| Concept | Status | Date | Notes |
|---|---|---|---|
| Transactional email (Resend) | — | | |
| Object storage (Cloudflare R2) | — | | |

---

## Session log
*Newest first. Date, what we covered, what landed, what to revisit.*

- **2026-11-08 (Maximus, session 11)**: HAFW: map matched up (shared borders merged, loose ends joined), Grimgarth given its border (option A, whole unclaimed strip). Found the rounding/upkeep questions were already settled in the Register (decisions 45, 46, 63, 108). Then Maximus had Claude download his `Luukcii/God` repo (a cloud session's faction-war rulebooks, map and Discord bot built on this site) and asked: (A) make it match the Register, (B) merge it in with a "Faction War" front page and Samurai / Berserkrs / Crusaders buttons, Discord + password sign-in, and faction-only details. Done: rulebooks and glossary rewritten against all 169 decisions (fixed: old Stone/Lumber prices, +50% Black Market markup, wealth upkeep, Knights→Crusaders, Ambush/raid/Grimgarth rules; filled ~20 gaps). `/war` now opens with his hand-lettered title from the Faction War project. Sign-up: `/war join` in Discord → private one-time link → password → log in with Discord name → pick a faction once. Fog of war: public sees land and tiers only; members see their own kingdom; bot replies privately. Closed a hole found on the way: Better Auth's built-in rename endpoint was open (anyone logged in could rename themselves). Introduced: proving identity (typing a Discord name proves nothing; the bot knows who ran the command), one-time links, fog of war done on the server (hiding in the browser isn't hiding). Nothing marked understood. Check question to ask: why can't the sign-up page just ask for your Discord name? Bot still needs Maximus's Developer Portal steps (docs/faction-war-bot.md).

- **2026-11-08 (Max, session 10)**: Max (calls Claude "Architect") wants to start a YouTube channel "from our notes", but no channel notes exist here, in memory, or in the Freebuff/Black Citadel archives (probably a ChatGPT chat). Asked him to describe it. First he asked whether microsoft/VibeVoice suits automated voices. Verdict: the repo is genuine (Microsoft, MIT), but its long-form TTS code was pulled 2025-09-05 for misuse, it's marked "research only, not for commercial use", and his PC (i5-4590, AMD GPU, no NVIDIA) can't run it well. Recommended Kokoro (Apache-2.0, runs on CPU), with Chatterbox (MIT, voice cloning, slow on CPU) and Piper (GPL, fast, robotic) as backups. Introduced: software licenses (what you're allowed to do), unofficial forks as a supply-chain risk. Nothing marked understood. No website work.
  - Then Max sent the Kokoro-82M Hugging Face page. Vetted it: official author (hexgrad), Apache-2.0, ~12M downloads, trained on permissive audio, 54 voices; the page itself warns about scam "kokoro" websites. Introduced: file fingerprints (SHA256) to prove a download is the real file, and that `.pth` model files can carry code (only load them from the official source). Pointed him to the browser demo to pick a voice first. Local install still needs a real Python (only the Microsoft Store shortcut is on the PC) plus PyTorch. Asked before installing.
  - Max said "go" and set names: call him **Maximus**; Claude = Architect, ChatGPT = Archivist. Installed Python 3.12 (winget, user scope; winget verified the installer hash, a live example of fingerprints). Made `C:\Users\User\Github\Voice Studio` (not a git repo) with a `.venv` (virtual environment = sealed toolbox), CPU PyTorch, Kokoro 0.9.4 and `say.py` (text → .wav; refuses the model if its SHA256 doesn't match; it matched). A spaCy helper download hit a GitHub 504 and installed on retry. First clips: `clips/test_af_heart|am_michael|bm_george.wav` (~30 s to make each on the i5). Waiting on: Max picks a voice, describes the channel, answers "what would say.py do with a tampered file?".
  - Max asked for Onyx + Lewis: made `test_am_onyx.wav` / `test_bm_lewis.wav`; told him Kokoro grades them D / D+ (af_heart = A), offered voice blending. Then he sent **Applio** (IAHispano, RVC voice *conversion*). Vetted: genuine, MIT, ~4k stars, maintenance mode, sensible terms (commercial OK with rights). Not installed: Windows installer targets NVIDIA (CUDA), his AMD/i5 can't train models; its built-in TTS is edge-tts (unofficial use of Microsoft's online voices); the shared voice-model ecosystem is mostly unlicensed celebrity/character clones and `.pth` files from strangers. Introduced: a fingerprint proves a file is *unchanged*, not that its maker is trustworthy. Suggested: later, via Google Colab, train a signature voice from his own recordings.
  - Agreed not to download Applio (bookmarked in `Voice Studio\LATER.md`; unused software = unpatched door). Max wants "a mix of both and my own": `say.py` now blends voices by weight + `--accent a|b`; made 4 Onyx/Lewis blends (`clips/blend_*.wav`). Own voice: Chatterbox (MIT, clones from ~20 s, no training) installing into a separate `.venv-chatterbox` (needs torch 2.6 / numpy<2, would break Kokoro's toolbox). Mic: Turtle Beach Stealth 700P. He sent WhisperX (via sourcepulse.org): vetted (BSD-2, 25k stars), parked in LATER.md for subtitles. Introduced: your voice is biometric, keep the sample private. Waiting on: his 20 s recording, blend pick, channel idea.
  - Max didn't know the Start button (bottom-left Windows logo / Windows key); opened Voice Recorder for him. He recorded 22.3 s (no clipping, -26 dBFS). Copied to `Voice Studio\my-voice\` (private). Chatterbox model is `.safetensors` (can't carry code; contrast with `.pth`). `clone.py` made `clips/maximus_clone_test.wav` (10.8 s in ~190 s on CPU). Original `Recording.m4a` still in Documents\Sound recordings; asked if he wants it deleted.
  - He liked the clone ("Mmmm! Very good"), asked for a slight British accent + slightly deeper. Explained Chatterbox's two layers (how you speak / how you sound). Made `maximus_A_light.wav` (30% Lewis speaking style, -1.5 semitones). Then he asked for "more like Lewis with a smidge of me, and more like Onyx with a smidge of Lewis". Rewrote `clone.py` with `--mix a.wav:0.6,b.wav:0.4` (blends both layers' fingerprints), `--rhythm-from`, `--tone-from`, `--pitch`. Kokoro reference clips in `Voice Studio\accents\`. Making mix1 (Lewis 85/me 15), mix2 (Onyx 85/Lewis 15), mix3 (Onyx 60/Lewis 30/me 10, British rhythm). Lesson for me: don't rewrite a script while a batch that calls it is still running (stopped the old batch).
  - He passed on all mixes: **narrator = his clone test as-is** (`clips/maximus_clone_test.wav`). `clone.py` now defaults to his sample; all mixing tools kept (he interrupted when he thought I was stripping them; clarified with options). Kept the original recording (his call). Next: the channel idea, then a first real script.

- **2026-11-05 (Max, session 9)**: Max wants a second, separate website for his Faction War. He ran `npx create-next-app` himself; renamed the folder in File Explorer to `C:\Users\User\Github\Faction War` (chose to keep the space; package name set to `faction-war`). Slowed down to teach folders/paths (drawers analogy). He first typed `cd` into a browser search, then found the VS Code terminal via Terminal > New Terminal. He deleted `cat-fireball` (confirmed on purpose; it's in the Recycle Bin). He ran `npm run dev` on it and saw the starter. He clicked its "Deploy now" and reached Vercel signup; stopped him (accounts = owner's call; GitHub before Vercel). Then he asked Claude to set the folder up with security: done (headers copied from this site, placeholder Hero, `CLAUDE.md` + session log in that folder, local git commit `2fda243`, no remote). Future Faction War sessions log there; this concept table stays the single tracker. Not yet: GitHub/Vercel (a new repo + Vercel project need the owner's access or Max's own accounts). Remind: HAFW rules are private, so decide what's public before pushing. Prediction unanswered: can anyone online see the new site yet?

- **2026-10-29 (Max, session 8)**: Max brought his Holy Alliance Faction War (BC-004) game rules over from ChatGPT, then pasted his own notes and three maps. Compared them line by line, re-checked all the economy math (correct), and Max answered ~20 A/B questions. Result: one "Hardset Register" in `Documents\Black Citadel Archive` (private, outside the public repo), with a dated decision log and a Superseded table. Introduced: change control (never erase old decisions; log what replaced them, same idea as git commits). Open: where each capital sits on the maps. No website work this session.

- **2026-10-29 (Max, session 7)**: Max moved his Freebuff work here. 7 Freebuff chats exported to readable files in `Documents\Freebuff Archive` (private, outside this public repo). Projects moved from `Desktop\Freebuff Test` to `C:\Users\User\Github\` (AetherLink, Family Chart, Kingdom Edition, ManaLens, The Good Book, cat-fireball, Knights-Keep.zip; GENESIS copied from Freebuff's folder). Marketing Pairing Lab was locked (leftover Freebuff bash.exe; Max ended them in Task Manager, still locked), so it was copied; the Desktop original should be deleted after a restart. Key scan: chats clean; Kingdom Edition holds a `.env` key and a browser profile, which is fine locally but must never be pushed public. Introduced: a public repo is world-readable, so private chats live outside it; "file in use" locks. Left Freebuff's build leftovers (`_probe`, `build`, `dist`) on the Desktop. Check question (why chats outside the repo?): he said "they aren't related to the website", which is partly right, so I retaught the privacy reason (public repo = shop window). Kingdom Edition is his next separate project. AetherLink = PS5/PC/TV switching guide + PowerShell app from a Freebuff chat; he hadn't recognised it; kept.

- **2026-11-05 (Max, session 8, cloud)**: Max asked for the HAFW faction war on the site: a player rulebook, a full technical rulebook, an interactive map with every stat, and a Discord bot to run the war. Rules pulled from his claude.ai artifacts (Store & Black Market catalog, economy & war tests, map); the Hardset Register itself wasn't reachable, so 18 gaps are marked "not in this book yet". Built on branch `claude/faction-war-rulebook-map-bx3l9d`: `/war/rules`, `/war/rules/full` (tap any underlined word → closeable pop-up, Back inside pop-ups, A–Z glossary), `/war/map` (drag/pinch/zoom, tappable territories, stats, Envoys/Attacks/ambushes/raids moving, example data until live), bot endpoint `/api/discord/interactions` + `war_*` tables (migration 0007, not applied yet). Setup steps in `docs/faction-war-bot.md`. Introduced: webhook/"doorbell" endpoint, signatures (proving a message came from Discord), replay attacks, why one-server-only matters, secret vs public info (fog of war). Open: Max sends Application ID, Public Key, Server ID; owner adds bot token; Claude migrates + sets env vars. Check question unanswered: why does the website never need the bot token?

- **2026-10-28 (Max, session 6, cont.)**: Max asked to switch on file storage + picture uploads. R2 needs the owner's payment method, so pictures go in the database instead (small, re-drawn). Built: upload your own emblem/banner on `/profile` (replaces the preset; remove to go back), admin can remove anyone's pictures from their profile page. Introduced: never trust a file's name (check contents), re-encoding strips hidden data like GPS location, SVG can carry scripts so it's refused, upload limits (3 MB, 10/hour). Nothing marked understood.

- **2026-10-28 (Max, session 6)**: Max asked for game-style **player cards** (banner, emblem, name, callsign), **blocking**, DMs to anyone, and **pop-up notifications** in the friends sidebar. Built: `/profile` (pick banner/emblem/color from preset lists + callsign + bio, live preview), `/members/<id>` (card + Message / Add friend / Block), blocks work both ways (no requests, no messages, hidden from each other; ends friendship; only the blocker can unblock), DMs open to any member unless blocked (online dot stays friends-only), sidebar shows emblems, a "Messages" section for non-friends, and pop-ups for new messages/requests (checks every 15 s). Introduced: choosing from a list instead of free input (no CSS injection), why names aren't editable (impersonation), polling cost vs speed. Uploading his own emblem images waits for storage (R2). Nothing marked understood.

- **2026-10-28 (Max, session 5)**: Max wants his ChatGPT history moved here. Explained: Claude can't log into ChatGPT (would need his password, never share it); chats are private so they never go into the public repo. Route: ChatGPT export → local script that indexes it → he picks. He pasted a ChatGPT-written "Archivist" handoff doc (HAFW faction-war economy, GENESIS/Botchelor, Black Citadel archive, Good Book, Knights Keep); it was cut off at the 50k paste limit. Pointed him to Claude's built-in memory importer, flagged an API key exposed in an old ChatGPT chat (rotate it). Check question unanswered: why run the script locally instead of reading every chat?

- **2026-10-28 (Max, session 4)**: Max asked for reviews as a **0–100% approval** (not stars) with a slider + buttons + optional comment, plus a **friends sidebar** with green online dots and **direct messages**. Built and pushed in two commits: reviews (`/projects/<slug>`, projects moved to `src/content/projects.ts` with slugs, DB check keeps 0–100); then friends (`/friends`: add/accept/decline/remove), sidebar on every page for signed-in members (heartbeat every 30 s → online if seen in 90 s), chat at `/messages/<id>` (friends only, refreshes every 5 s, text logged to activity as "messaged X" without content). Introduced: slug, heartbeat/polling cost, authorization per row (only the receiver can accept; only friends can message). Gentle note: he said "percentile"; it's a percentage (percentile = rank among others). Nothing marked understood; open questions: blurb for The Good Book, the /admin prediction.
  - Then: Max said "fix the issue / secure the passage" and sent a screenshot (`review` undefined in `listReviews`): stale dev server again → restart. Read the error with him (the one line that matters). Also found in Vercel logs: prefetching made Better Auth log failed session lookups **with session tokens** (25×). Fixed (`connection()` in `getUser`, redacting logger), pushed, and revoked all 10 old sessions (everyone logs in again). Introduced: logs can leak secrets; rotate on exposure.

- **2026-10-28 (Max, session 3)**: Max wants a side project and asked how the setup was done. Walked through it in order: your computer (Node, create-next-app, git) → GitHub (a copy online) → Vercel (watches GitHub, deploys every push) → extras (Neon, auth, Resend, tokens + CLAUDE.md). Main point: local first, and "switching over" is just a push. Flagged that Claude's tokens only reach *this* repo/project, so a new project needs new access from Caleb (or Max's own accounts). Check question asked: what happens to the live site if you commit but don't push?

- **2026-10-27 (Max, session 2)**: Max asked for a guestbook, reviews on projects, a friend system, and an admin box (lower-left) showing everyone's activity. He chose: invite-only accounts, signed-in posting, one feature at a time. Found: any logged-in user was treated as admin, so **Stage 1 = roles + invite links** (done, pushed). `user.role` (admin/member), `requireUser`/`requireAdmin`, invite links in the admin "Invites" panel (one use, 7 days, stored hashed), `/join/<token>` page, Zod validation. Introduced: authentication vs authorization (key card for the front door vs the manager's office), Server Actions, hashing tokens. Nothing marked understood. Next: Max makes a real invite live; then Stage 2 guestbook → 3 activity box → 4 reviews → 5 friends (plan in `.claude/plans`).
  - Then (same session): Max said "build the guestbook" + "add the box window for things members do", and renamed project one to **"The Good Book"** (blurb still placeholder). Built Stages 2+3 together: `/guestbook` (anyone reads, members post, 5 posts/10 min limit, admin can delete) and the **Activity** box (lower-left of `/admin`) fed by an `activity` logbook table (sign-ins, joins, posts, deletes). Login now sends members to `/guestbook`, admin to `/admin`. Introduced: XSS (post text shown as text, never run), audit log. Fixed a Stage 1 bug: `/join` used "now" before the request (`connection()`). Max didn't answer the "what happens at /admin as a member?" prediction yet — ask again. Max's dev server held stale code → needs restart.

- **2026-10-27 (Max, session 1, cont.)**: Max redesigned the hero. Pixel knights in many colors (a `PixelKnight` component with a `color` **prop**); he changed one to black (hex colors). Title went from stone font → cobblestone texture inside letters → letters *built* as castle walls (grid data in `castle-glyphs.ts`, real CC0 Poly Haven photo, shrunk 619→61 KB). He has strong visual taste and iterates by reacting to screenshots; show, then ask. Introduced: props, hex colors, `public/` folder, image licensing, CSP/self-hosting, clickjacking (frame block), dev-server restart + hard refresh. Nothing marked understood yet; check questions (gold knight? which file for a new menu link?) unanswered. Hero not yet pushed. Then: thicker 2-block strokes for readability, crusader banners on capitals, grassland (CC0 grass photo) with knights standing in it at different depths. Scene split into one-job parts (glyph data, layout, letters, flag, grass, scene). Max said "push and deploy"; live ~30s after push (commit ce1647e).
- **2026-10-27 (Max, session 1)**: Max said hi, then his first request: a "Log in" link in the header menu. Added it to `site-nav.ts` and pushed (deploys live). Introduced: one list feeding the menu (data separate from UI), and a hidden link isn't security. Still to do from first-session plan: confirm `npm run dev` works, compare localhost vs live, he deletes `.admin-credentials.txt` after logging in.

- **2026-10-27 (handoff)**: Setup finished by the owner: GitHub, Vercel, Neon and Resend are connected; Claude manages them all. Ready for Max. Next session is his first, so follow "Max's first session" in CLAUDE.md. Nothing below is marked as learned yet; everything so far was the owner's setup.
- **2026-10-27 (later)**: Site is live at https://training-repository-ten.vercel.app. Every push to `main` redeploys it. First thing for Max: show him the live site next to `localhost:3000`. It's the same code in two places, which makes a good way into "localhost vs deployed" and "what a push does".
- **2026-10-27**: Owner set up the project: Node installed, pilot site built (one-page portfolio, header/menu/footer, login, admin dashboard with empty control-surface panels). Max not yet onboarded. Good first session: open the terminal, run `npm run dev`, see the site, log in with `.admin-credentials.txt`, then ask what he wants to change.
