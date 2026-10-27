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

- **2026-10-27 (handoff)**: Setup finished by the owner: GitHub, Vercel, Neon and Resend are connected; Claude manages them all. Ready for Max. Next session is his first, so follow "Max's first session" in CLAUDE.md. Nothing below is marked as learned yet; everything so far was the owner's setup.
- **2026-10-27 (later)**: Site is live at https://training-repository-ten.vercel.app. Every push to `main` redeploys it. First thing for Max: show him the live site next to `localhost:3000`. It's the same code in two places, which makes a good way into "localhost vs deployed" and "what a push does".
- **2026-10-27**: Owner set up the project: Node installed, pilot site built (one-page portfolio, header/menu/footer, login, admin dashboard with empty control-surface panels). Max not yet onboarded. Good first session: open the terminal, run `npm run dev`, see the site, log in with `.admin-credentials.txt`, then ask what he wants to change.
