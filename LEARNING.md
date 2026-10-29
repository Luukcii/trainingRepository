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

- 

---

## Concepts

### 0. Tools & the console
| Concept | Status | Date | Notes |
|---|---|---|---|
| What a terminal/console is | — | | |
| Running a command; reading output | — | | |
| Folders & paths (`cd`, current directory) | — | | |
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
