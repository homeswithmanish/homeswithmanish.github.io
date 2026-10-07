# External Profiles Kit (off-site SEO / AEO)

Audit date: 2026-10-07. Goal: every third-party profile states the *same* name, address,
phone (NAP), license number and website, and links back to homeswithmanish.com. Search
engines and AI answer engines merge an entity from these citations; mismatches split it
(and several namesakes already compete for "Manish Anand").

Once a profile is live, send me its URL: it gets added to the `sameAs` arrays in
`index.html` + `about-manish-anand/index.html` and to `tools/entity-facts.md`.
**Never** add a URL you have not confirmed is yours (see namesakes at the bottom).

## 1. Canonical NAP: copy exactly

| Field | Value |
|---|---|
| Name (person) | Manish Anand |
| Business / brand | Homes With Manish |
| Title | REALTOR® · Real Estate Agent |
| License | CA DRE #02247006 |
| Brokerage | MOSO Real Estate (Loan Factory, Inc., CA DRE #01771313) |
| Office address | 2195 Tully Road, San Jose, CA 95122 ⚠️ see open question |
| Phone | (408) 707-5324 |
| Email | homeswithmanish@gmail.com |
| Website | https://homeswithmanish.com |
| Service area | San Ramon, Pleasanton, Danville, Dublin, Livermore, Fremont, Tracy, Mountain House |
| Primary category | Real estate agent |

**Open question: the office address.** The website and DRE record use **2195 Tully Road**.
MLSListings shows **639 Tully Road, Suite C**. Ask the broker which one is the office of
record, then make MLSListings and the site match. For Google / Bing / Apple, register as a
**service-area business** and hide the street address unless clients can visit it.
Never use the San Ramon mailing address on the DRE record; it's residential. If you want
it off the public record, you can change it to the business address through DRE eLicensing.

## 2. Bios (no experience-length or client-count claims, no "free to buyers" wording)

**Short (≈150 chars: Instagram, X, directory taglines)**
> East Bay realtor (CA DRE #02247006) serving San Ramon, Pleasanton, Dublin & the Tri-Valley. Data-driven advice for buyers, sellers & investors.

**Medium (≈300 chars: Zillow/Realtor.com headline, LinkedIn headline + about opener)**
> Manish Anand is a San Ramon-based REALTOR® (CA DRE #02247006) with MOSO Real Estate, serving
> San Ramon, Pleasanton, Danville, Dublin, Livermore, Fremont, Tracy and Mountain House. He helps
> buyers, sellers and investors decide with live market data, true-cost math (including
> Mello-Roos) and free calculators at homeswithmanish.com.

**Long (≤750 chars: Google Business Profile description, Bing Places, Apple)**
> Homes With Manish is the real estate practice of Manish Anand, a licensed California
> REALTOR® (CA DRE #02247006) with MOSO Real Estate. Based in San Ramon, Manish serves buyers,
> sellers and single-family investors across the East Bay and Tri-Valley: San Ramon,
> Pleasanton, Danville, Dublin, Livermore, Fremont, Tracy and Mountain House. His approach is
> data-first: live Zillow market data by city, true monthly cost analysis including HOA dues
> and Mello-Roos/CFD special taxes, rental-yield math for investors, and neighborhood guides
> for areas like Dougherty Valley, Dublin Ranch and Mission San Jose. Free calculators and city
> guides at homeswithmanish.com. Call (408) 707-5324.

## 3. Platform checklist (ordered by impact)

| # | Platform | Status (2026-10-07) | Action | Where |
|---|---|---|---|---|
| 1 | Google Business Profile | Not confirmed | Create/verify as a service-area business; category *Real estate agent*; long bio; 8 cities; photos; weekly post. Full steps in `docs/GROWTH-PLAYBOOK.md` §1 | business.google.com/create |
| 2 | Zillow agent profile | Not confirmed | Search Zillow for DRE 02247006 first. Claim or create; medium bio; add service areas + website. **Do not touch `zillow.com/profile/mkanand`; that's a different person** | zillow.com/agent-resources |
| 3 | Realtor.com | Not confirmed (an MLS-fed stub likely exists) | Find yourself under "Find a REALTOR®" → claim; medium bio + website | realtor.com/realestateagents |
| 4 | MLSListings | **Found**: mlslistings.com/FindAnAgent/Profile/02247006 (already in site `sameAs`) | Fix the office address (see the open question in §1); add Instagram/Facebook links (only YouTube is listed) | MLSListings member portal |
| 5 | Homes.com | Not confirmed (other MOSO agents are listed) | Search by name → claim | homes.com/real-estate-agents |
| 6 | LinkedIn | Not confirmed | Headline: "REALTOR® · CA DRE #02247006 · MOSO Real Estate · Homes With Manish"; website field; medium bio | linkedin.com |
| 7 | Bing Places | Not confirmed | Import from Google Business Profile once it's verified (feeds Copilot + ChatGPT search) | bingplaces.com |
| 8 | Apple Business Connect | Not confirmed | Same details as Google (feeds Siri / Apple Maps) | businessconnect.apple.com |
| 9 | HomeLight | **Unclaimed stub**: homelight.com/agents/manish-anand-ca-02247006 (shows HomeLight's phone, not yours) | Claim if HomeLight allows; otherwise leave it. Not added to `sameAs` | homelight.com/agents |
| 10 | Experience.com | Not found; its unclaimed agent pages rank for "realtor San Ramon" | Create a profile; a good place to collect reviews later | experience.com |
| 11 | Nextdoor Business | Not confirmed | Business page with San Ramon / Danville neighborhoods | business.nextdoor.com |
| 12 | Bay East Association directory | Not confirmed | Make sure your member profile shows the site + phone | bayeast.org member portal |
| 13 | Facebook | Exists (profile.php?id=…) | Set a vanity username (facebook.com/homeswithmanish), then tell me so the site links update | Page settings |
| 14 | Brokerage site | No agent roster found on loanfactory.com | Ask the broker for an agent page linking to homeswithmanish.com | Broker |

Skip: Wikidata (notability bar not met), RealTrends (profiles come from ranking data), Redfin
(partner-only), FastExpert / Rate My Agent (pay-to-play, little US traction).

## 4. After each profile goes live
1. Send me the URL → it's added to the schema `sameAs` arrays and the entity facts.
2. After every deploy, run `node tools/indexnow.mjs` so Bing (and through it ChatGPT search
   and Copilot) recrawls the site.
3. Once 3 or more real Google reviews exist: re-enable reviews and AggregateRating on the site
   from those real reviews (D-006).

## Namesakes: never link these
Bengaluru real estate consultant (Real Unity) · Indian film actor · TERI researcher · Accenture
executive · Euler Solutions CEO (San Ramon, not a realtor) · Zillow `mkanand` · "Homes By
Manish" / Manish Nadkarni · mosorealestate.com (a Vietnamese proptech company, not the brokerage).
