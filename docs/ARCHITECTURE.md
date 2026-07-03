# Architecture Document — Homes With Manish
**Status:** Living document. Updated with every approved decision.
**Last updated:** 2026-07-03 (initial current-state audit)

---

## 1. Current State (as-built, v1)

### 1.1 Hosting & Delivery
| Layer | Implementation |
|---|---|
| Frontend | Static HTML/CSS/vanilla JS, single-page `index.html` (~1,985 lines) + blog + legal pages |
| Hosting | GitHub Pages, custom domain `homeswithmanish.com` (CNAME) |
| CI/CD | GitHub Actions: HTML validation, tag-balance checks, internal-link checks, size checks → deploy to Pages |
| Backend | Google Apps Script web app (single deployment URL) bound to a Google Sheet |
| Data store | Google Sheets tabs: `Leads`, `MarketData`, `MortgageRates`, `RentalData`, `Newsletter` |
| Analytics | Google Analytics 4 (G-CK983XLXCC) |

### 1.2 Features live today
- **Lead capture** — hero + contact forms POST to Apps Script; rate-limited (5/email/24h); email notification to homeswithmanish@gmail.com; guide-request flow auto-emails PDFs.
- **Admin dashboard** — `admin.html` (public URL, API-key gated) lists/updates leads, shows stats.
- **Live market data** — Zillow ZHVI (SFH) for 8 cities, fetched monthly by Apps Script into Sheets, rendered client-side.
- **Mortgage rates** — Freddie Mac PMMS weekly fetch + 4-week trend.
- **Rental data** — Zillow ZORI; rental-yield table (gross yield, price-to-rent).
- **Monthly payment calculator** — city-aware PITI estimate using live median price + live rate.
- **Weekly newsletter** — Apps Script generates branded HTML Gmail draft every Monday from live data; subscribers BCC'd; manual review + send.
- **Data staleness monitor** — daily 8 AM check; alerts if any data sheet >7 days stale or has blanks.
- **Blog** — 6 hyperlocal SEO posts (San Ramon, Dublin, Pleasanton, Tri-Valley comparisons).
- **Downloadable guides** — 3 PDFs (First-Time Buyer Checklist, East Bay Investment Guide, Relocating to East Bay).
- **SEO** — meta/OG/Twitter tags, canonical, sitemap.xml, robots.txt, and 7 JSON-LD blocks (RealEstateAgent, LocalBusiness, Person, WebSite+SearchAction, FAQPage ×10, BreadcrumbList, AggregateRating).

### 1.3 Identity & compliance facts
- Manish Anand, Licensed REALTOR®, DRE #02247006, brokerage: REeBroker Group (San Marcos, CA).
- Service area: San Ramon, Pleasanton, Danville, Dublin, Livermore, Fremont, Tracy, Mountain House.
- Brand: navy `#0F1B2D` / gold `#C9A96E`, Playfair Display + Inter.
- Socials: Instagram, Facebook, YouTube (@HomesWithManish).

### 1.4 Known issues / risks in current build (found in audit)
1. **Compliance — buyer compensation language.** FAQ + FAQPage schema state buyer representation is "free… compensated by the seller's commission split." Post-NAR-settlement (Aug 2024) rules require written buyer-broker agreements and this framing is now a compliance/liability risk. Needs rewrite.
2. **AggregateRating schema (5.0, 3 reviews)** with no visible on-page reviews source — risk of a Google structured-data manual action.
3. **Testimonials** appear illustrative; if not from real clients, they are a DRE advertising-rule risk.
4. **Sitemap uses `#fragment` URLs** — Google ignores fragments; only `/` and blog URLs are indexable.
5. **`WebSite SearchAction` schema** points to `/search?q=` which doesn't exist.
6. **Single Apps Script URL** serves both public actions and admin actions; admin key travels as a GET query param (logged in browser history/proxies).
7. **Scalability ceiling** — no server, no auth, no database beyond Sheets; client portal, IDX search, and AI features cannot be built on the current stack.
8. ~~Stats claim "8 cities" but one guide card says "all 7 cities" — copy drift.~~ Fixed in Phase 0.
9. **URGENT (found 2026-07-03, Phase 1 verification): the Apps Script web app returns HTTP 403 "Access Denied — You need access" to anonymous server-side requests.** The same URL is what index.html calls from visitors' browsers for market data, mortgage rates, rental yields, AND form submissions (doPost). If the deployment's "Who has access" is no longer "Anyone", these features are likely failing for all logged-out visitors right now. **Fix (Manish, ~2 min):** Apps Script editor → Deploy → Manage deployments → ✏️ edit the active deployment → Execute as: *Me*, Who has access: *Anyone* → Deploy. If Google issues a new /exec URL, update `SCRIPT_URL` in index.html and `GOOGLE_SCRIPT_URL` in admin.html, and `APPS_SCRIPT_URL` in the app tier env.

## 2. Target Architecture (per D-001, approved 2026-07-03)

**Hybrid two-tier platform:**

```
homeswithmanish.com          (GitHub Pages — static, SEO/marketing tier)
├── index.html               existing marketing site (kept as-is)
├── blog/                    hyperlocal content (grows continuously)
├── cities/<city>/           generated city market pages   ← build step
├── calculators/<name>/      generated calculator pages    ← build step
└── docs/                    this architecture + decision log

app.homeswithmanish.com      (Vercel — Next.js App Router, dynamic tier)
├── /api/leads               lead capture API (replaces Apps Script POST over time)
├── /crm                     custom CRM (Manish-only, Supabase Auth)
├── /portal                  client portal (per-client dashboards, later phase)
├── /assistant               AI concierge (Claude API, grounded on own content/data)
└── /search                  IDX search (after D-002 feed verification)

Supabase (Postgres + Auth + Storage + Row Level Security)
├── contacts, leads, deals, tasks, notes, communications   (CRM core)
├── market_data, mortgage_rates, rental_data               (mirrors Sheets pipelines)
├── documents (Storage buckets, RLS per client)
└── designed with org_id / product_line columns so a future mortgage
    vertical (MLO) adds tables, not a redesign

Data pipelines: existing Google Apps Script fetchers keep running (they work,
are monitored for staleness, and are free). A scheduled GitHub Action or
Supabase cron mirrors Sheets → Postgres so the app tier reads from Postgres.
Cutover from Sheets happens only when the app tier is proven.
```

**Tech choices & why (budget D-003: $100–300/mo):**
| Choice | Why |
|---|---|
| Next.js 15 (App Router, TypeScript) on Vercel | Server components + API routes + ISR; free→$20/mo; Manish already writes production TS |
| Supabase | Postgres + Auth + Storage + RLS in one; free→$25/mo; pgvector available for AI retrieval (note: use `prisma db push` for pgvector types per machine profile) |
| Prisma | Typed schema, matches Manish's stack preferences |
| Anthropic Claude API | AI assistant/concierge; grounded via pgvector retrieval over blog/guides/market data |
| Resend (or keep Gmail drafts initially) | Transactional + sequence email; free tier 3k/mo |
| GitHub Actions | Already in place; extends to page generation + data mirroring |

**Migration posture:** the static site is never broken; every new capability is additive. Full Next.js migration of the marketing tier is a *possible* later decision, not a dependency.

## 3. Roadmap
See `docs/ROADMAP.md` (phases 0–4, each gated on approval per project charter).
