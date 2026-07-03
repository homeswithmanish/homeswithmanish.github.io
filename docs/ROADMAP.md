# Roadmap — Homes With Manish Platform
Phases are approval-gated (project charter). Status: **Phases 0 & 2 COMPLETE. Phase 1 code COMPLETE — production launch pending Manish's setup checklist (below + `homeswithmanish-app/README.md`). Phase 2 shipped 2026-07-03: city pages, calculators, growth playbook (`docs/GROWTH-PLAYBOOK.md`).**

---

## Phase 0 — Compliance & SEO hygiene (current static site)
**Timeline:** 1 day · **Cost:** $0 · **Priority:** URGENT · **Dependencies:** none

**Executive summary:** Fix legal/compliance exposure and structured-data risks on the live site before building anything new. No visual redesign; surgical edits only.

**Scope (exact changes, wording below for approval — D-006):**
1. **Buyer-compensation language** (FAQ section + FAQPage JSON-LD). Replace "Yes. Buyer representation is free to you… compensated through the transaction" with post-NAR-settlement-compliant wording:
   > *"How do you get paid as a buyer's agent?"* — "We'll sign a written buyer representation agreement up front that spells out my compensation clearly — that's now required in California and it protects you. In many transactions the seller offers to cover some or all of the buyer's agent fee, and I always negotiate for that. Either way, you'll know exactly what I earn and who pays it before we ever tour a home — no surprises."
2. **Remove the AggregateRating JSON-LD block** (5.0/3 reviews, no on-page review source) until real, displayed reviews exist (e.g., Google reviews embedded).
3. **Testimonials:** Manish confirmed they were not real → section removed. Re-add with real client reviews expected end of July 2026 (prefer pulling from Google Business Profile so schema is substantiated).
4. **Sitemap:** remove `#fragment` URLs; list `/`, all 6 blog posts, blog index, privacy, terms.
5. **Remove `WebSite SearchAction` schema** (points to nonexistent `/search`).
6. **Copy drift:** "all 7 cities" → "all 8 cities" in the Investment Guide card.

**Risks:** none material; changes reduce risk.

---

## Phase 1 — Foundation: app tier + custom CRM (Weeks 1–4)
**Cost:** ~$0–45/mo · **Priority:** HIGH · **Dependencies:** Phase 0 approved

- Scaffold Next.js (TypeScript, App Router) on Vercel at `app.homeswithmanish.com`; Supabase project (Postgres, Auth, Storage); Prisma schema.
- **CRM v1 (D-005):** contacts, leads, pipeline stages (New → Contacted → Nurturing → Active → In Escrow → Closed → Past Client), timeline, notes, tasks, communication log, source attribution. Schema includes vendor/lender/referral-partner contact types and product-line column for future mortgage vertical.
- **Lead ingestion:** website forms dual-write (Apps Script + `/api/leads`) until parity proven; then Apps Script becomes backup.
- **Data mirror:** scheduled job copies MarketData/MortgageRates/RentalData sheets → Postgres.
- Deliverable: Manish manages all leads in his own CRM; admin.html retired.

## Phase 2 — SEO & lead-gen engine (Weeks 3–8, overlaps Phase 1)
**Cost:** $0 incremental · **Priority:** HIGH · **Dependencies:** none (static tier)

- **8 city pages** (`/cities/san-ramon/` …) generated from live market data: median price, trend chart, yield, schools, commute, FAQ + schema. The data pipelines already exist — this converts them into indexable pages.
- **Calculator suite v1** on main domain (static, client-side): Affordability, Buy-vs-Rent, Closing Costs, Property Tax (CA-specific incl. supplemental tax + Prop 19), Down Payment Planner. Each is its own indexable page targeting long-tail keywords.
- Blog cadence: 2 posts/month minimum, hyperlocal intent (Semrush keyword research available in-session).
- Google Business Profile optimization checklist + review-generation flow (feeds real reviews back to replace removed AggregateRating schema).

## Phase 3 — AI assistant + automation (Weeks 8–12)
**Cost:** +$20–80/mo (Claude API + Resend) · **Dependencies:** Phase 1 (Supabase, contact records)

- Public **AI concierge** on both tiers: Claude with retrieval (pgvector) over blog, guides, FAQ, live market data; answers buyer/seller/investor questions; hands off to lead capture conversationally; every conversation logged to CRM.
- **Email automation:** welcome sequences per lead type (buyer/seller/investor), newsletter migration to Resend with proper list management, drip nurture, review requests.

## Phase 4 — Client portal + IDX search (Months 3–6)
**Cost:** +$30–100/mo (IDX feed) · **Dependencies:** Phase 1 auth; D-002 verification

- Client portal: per-client dashboard, transaction timeline with stage tracking, document vault (Supabase Storage + RLS), saved searches/favorites, post-close equity tracker (ZHVI-powered — pipeline already exists).
- IDX search once MLSListings feed rights for East Bay (NorCal MLS Alliance share) + REeBroker sign-off are verified.
- Mortgage-ready architecture validated (schema supports MLO product line without redesign).

---

**Action items for Manish (external, cannot be done by the agent):**
0. **URGENT (D-010):** Apps Script deployment returns 403 "Access Denied" to anonymous requests — the live site's market data / rates / rental sections and possibly lead form POSTs may be broken for visitors. Apps Script editor → Deploy → Manage deployments → edit → Execute as *Me*, Who has access *Anyone* → Deploy. If the /exec URL changes, update it in index.html, admin.html, and the app's `APPS_SCRIPT_URL`.
1. **Phase 1 launch checklist (~30 min):** follow `homeswithmanish-app/README.md` — create Supabase project (+ admin user, signups disabled), import repo to Vercel with env vars, add DNS CNAME `app` → `cname.vercel-dns.com`, run `prisma db push` against Supabase, run `scripts/import-leads.mjs` backfill. Then I'll add the dual-write to the marketing site forms.
2. Contact MLSListings vendor/API program: request IDX (RESO Web API) access; ask explicitly whether NorCal MLS Alliance shared listings (Bay East/bridgeMLS coverage of Alameda, Contra Costa, San Joaquin counties) are includable in IDX display. Get REeBroker's signature on the IDX agreement.
3. Create the GitHub repo for `homeswithmanish-app` and push (or tell me and I'll push once the remote exists).
