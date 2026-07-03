// Static page generator for city pages and calculators.
// Usage: node tools/generate-pages.mjs
// Output: cities/<slug>/index.html, cities/index.html,
//         calculators/<slug>/index.html, calculators/index.html

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CITIES } from "./cities-data.mjs";
import { CALCULATORS } from "./calculators-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://homeswithmanish.com";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------------------------------------------------------------------------
// Shared layout (mirrors the shell used by index.html / blog pages)
// ---------------------------------------------------------------------------

const NAV = `
    <header class="navbar" id="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/" class="nav-logo" aria-label="Homes With Manish - Home">
                    <img src="/images/logo.svg" alt="Homes With Manish" height="48" width="160" style="height:48px;width:auto;">
                </a>
            </div>
            <nav class="nav-links">
                <a href="/#about">About</a>
                <a href="/cities/">Cities</a>
                <a href="/#market">Market Data</a>
                <a href="/calculators/">Calculators</a>
                <a href="/blog/">Blog</a>
                <a href="/#faq">FAQ</a>
                <a href="/#contact" class="nav-cta">Get Free Consultation</a>
            </nav>
            <button class="hamburger" id="hamburger" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
        </div>
    </header>
    <div class="mobile-menu" id="mobileMenu">
        <span class="mobile-close" id="mobileClose">✕</span>
        <a href="/#about">About</a>
        <a href="/cities/">Cities</a>
        <a href="/#market">Market Data</a>
        <a href="/calculators/">Calculators</a>
        <a href="/blog/">Blog</a>
        <a href="/#faq">FAQ</a>
        <a href="/#contact">Get Free Consultation</a>
    </div>`;

const FOOTER = `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <img src="/images/logo.svg" alt="Homes With Manish" height="44" width="150" style="height:44px;width:auto;margin-bottom:12px;">
                    <p>Data-driven real estate expertise for buyers, sellers, and investors across the East Bay. Your trusted partner in finding home.</p>
                </div>
                <div>
                    <h4>Explore</h4>
                    <div class="footer-links">
                        <a href="/#about">About</a>
                        <a href="/cities/">City Guides</a>
                        <a href="/calculators/">Calculators</a>
                        <a href="/blog/">Blog</a>
                        <a href="/#contact">Contact</a>
                    </div>
                </div>
                <div>
                    <h4>Cities</h4>
                    <div class="footer-links">
                        ${CITIES.slice(0, 5).map((c) => `<a href="/cities/${c.slug}/">${c.name}</a>`).join("\n                        ")}
                    </div>
                </div>
                <div>
                    <h4>Calculators</h4>
                    <div class="footer-links">
                        ${CALCULATORS.map((c) => `<a href="/calculators/${c.slug}/">${c.short}</a>`).join("\n                        ")}
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div>&copy; 2026 Homes With Manish. All rights reserved.<br>Manish Anand, CA DRE #02247006 | REeBroker Group, CA DRE #01522411</div>
                <div class="footer-legal">
                    <a href="/privacy.html">Privacy Policy</a>
                    <a href="/terms.html">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>`;

const BASE_JS = `
    <script>
    (function() {
      var navbar = document.getElementById('navbar');
      window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      });
      var hamburger = document.getElementById('hamburger');
      var mobileMenu = document.getElementById('mobileMenu');
      var mobileClose = document.getElementById('mobileClose');
      hamburger.addEventListener('click', function() { mobileMenu.classList.add('active'); });
      mobileClose.addEventListener('click', function() { mobileMenu.classList.remove('active'); });
      mobileMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target === mobileMenu) { mobileMenu.classList.remove('active'); }
      });
      var faqs = document.querySelectorAll('.faq-toggle');
      faqs.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var item = btn.parentElement;
          var open = item.classList.contains('active');
          item.classList.toggle('active', !open);
          btn.setAttribute('aria-expanded', String(!open));
          var icon = btn.querySelector('.faq-icon');
          if (icon) icon.textContent = open ? '+' : '−';
        });
      });
    })();
    </script>`;

const PAGE_CSS = `
    <style>
      .page-hero { background: var(--navy); color: var(--white); padding: 140px 0 64px; }
      .page-hero h1 { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); margin: 12px 0; }
      .page-hero p.tagline { color: var(--gray-400); font-size: 1.15rem; max-width: 640px; }
      .page-hero .price-band { display:inline-block; margin-top:18px; background: rgba(201,169,110,.15); border:1px solid var(--gold); color: var(--gold); border-radius: 999px; padding: 8px 18px; font-weight: 600; }
      .content-section { padding: 56px 0; }
      .content-section.alt { background: var(--off-white); }
      .content-section h2 { font-family: var(--font-display); color: var(--navy); font-size: 1.7rem; margin-bottom: 18px; }
      .content-section p.lead { color: var(--gray-600); line-height: 1.75; margin-bottom: 16px; max-width: 780px; }
      .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 28px; }
      .info-card { background: var(--white); border: 1px solid #eee; border-radius: 14px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,.04); }
      .info-card h3 { color: var(--navy); font-size: 1.05rem; margin-bottom: 8px; }
      .info-card p { color: var(--gray-600); font-size: .95rem; line-height: 1.65; }
      .check-list { list-style: none; padding: 0; margin: 16px 0 0; }
      .check-list li { padding: 8px 0 8px 30px; position: relative; color: var(--gray-600); line-height: 1.6; }
      .check-list li::before { content: "✓"; position: absolute; left: 0; color: var(--gold); font-weight: 700; }
      .cta-band { background: var(--navy); border-radius: 18px; padding: 44px 32px; text-align: center; color: var(--white); }
      .cta-band h2 { color: var(--white); font-family: var(--font-display); margin-bottom: 10px; }
      .cta-band p { color: var(--gray-400); margin-bottom: 22px; }
      .calc-card { max-width: 720px; margin: 32px auto 0; background: var(--white); border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,.08); padding: 36px; }
      .calc-form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
      .calc-results { margin-top: 28px; background: var(--navy); border-radius: 12px; padding: 22px 26px; display: none; }
      .calc-result-row { display: flex; justify-content: space-between; gap: 16px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,.08); color: var(--gray-400); font-size: .95rem; }
      .calc-result-row strong { color: var(--white); text-align: right; }
      .calc-result-row.calc-result-total { border-bottom: 0; padding-top: 14px; }
      .calc-result-row.calc-result-total strong { color: var(--gold); font-size: 1.15rem; }
      .live-stat-note { font-size: .85rem; color: var(--gray-400); margin-top: 10px; }
      .breadcrumb-bar { padding: 96px 0 0; }
      .breadcrumb-bar ol { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 0; font-size: .85rem; color: var(--gray-400); }
      .breadcrumb-bar a { color: var(--gray-600); text-decoration: none; }
      .breadcrumb-bar li + li::before { content: "›"; margin-right: 6px; color: var(--gray-400); }
      .hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 36px; }
      .hub-card { display: block; background: var(--white); border: 1px solid #eee; border-radius: 16px; padding: 28px; text-decoration: none; box-shadow: 0 2px 12px rgba(0,0,0,.05); transition: transform .2s, box-shadow .2s; }
      .hub-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(0,0,0,.1); }
      .hub-card h3 { color: var(--navy); font-family: var(--font-display); font-size: 1.25rem; margin: 8px 0; }
      .hub-card p { color: var(--gray-600); font-size: .95rem; line-height: 1.6; }
      .hub-card .hub-emoji { font-size: 1.8rem; }
      .hub-card .hub-band { color: var(--gold); font-weight: 700; font-size: .95rem; margin-top: 10px; display: block; }
    </style>`;

function layout({ title, description, canonicalPath, breadcrumbs, schemas, body }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `${SITE}${b.path}`,
    })),
  };
  const allSchemas = [breadcrumbSchema, ...schemas]
    .map((s) => `    <script type="application/ld+json">\n    ${JSON.stringify(s, null, 2).split("\n").join("\n    ")}\n    </script>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${SITE}${canonicalPath}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE}${canonicalPath}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:image" content="${SITE}/images/logo-square.svg">
    <meta name="twitter:card" content="summary">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect fill='%230F1B2D' width='32' height='32'/><path fill='%23C9A96E' d='M16 4l8 8v12H8V12l8-8z'/></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
${PAGE_CSS}
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-CK983XLXCC"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CK983XLXCC');
    </script>
${allSchemas}
</head>
<body>
${NAV}
    <main>
        <div class="breadcrumb-bar">
            <div class="container">
                <nav aria-label="Breadcrumb"><ol>
                    ${breadcrumbs.map((b, i) => (i === breadcrumbs.length - 1 ? `<li><span aria-current="page">${esc(b.name)}</span></li>` : `<li><a href="${b.path}">${esc(b.name)}</a></li>`)).join("\n                    ")}
                </ol></nav>
            </div>
        </div>
${body}
        <section class="content-section">
            <div class="container">
                <div class="cta-band">
                    <h2>Let's Talk Strategy</h2>
                    <p>Free consultation, zero pressure — market analysis, financing guidance, and a plan built around your goals.</p>
                    <a href="/#contact" class="btn btn-primary btn-lg">Get Your Free Consultation</a>
                </div>
            </div>
        </section>
    </main>
${FOOTER}
${BASE_JS}
</body>
</html>
`;
}

const faqSchema = (faq) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

const faqHtml = (faq) => `
        <section class="content-section alt">
            <div class="container">
                <div class="section-label">FREQUENTLY ASKED</div>
                <h2>Common Questions</h2>
                <div class="faq-wrapper">
                    ${faq.map((f) => `<div class="faq-item">
                        <button class="faq-toggle" aria-expanded="false"><span>${esc(f.q)}</span><span class="faq-icon">+</span></button>
                        <div class="faq-content">${esc(f.a)}</div>
                    </div>`).join("\n                    ")}
                </div>
            </div>
        </section>`;

// ---------------------------------------------------------------------------
// City pages
// ---------------------------------------------------------------------------

function cityPage(city) {
  const title = `Living in ${city.name}, CA — Homes, Schools & Market Guide | Homes With Manish`;
  const path = `/cities/${city.slug}/`;
  const schemas = [
    faqSchema(city.faq),
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: "Manish Anand",
      url: SITE,
      telephone: "+1-408-707-5324",
      areaServed: { "@type": "City", name: city.name, addressRegion: "CA" },
    },
  ];

  const body = `
        <section class="page-hero" style="padding-top:24px;">
            <div class="container">
                <div class="section-label" style="color:var(--gold);">${city.emoji} CITY GUIDE</div>
                <h1>Living in ${city.name}, California</h1>
                <p class="tagline">${esc(city.tagline)}</p>
                <div class="price-band">Median SFH: ${esc(city.priceBand)} <span id="live-median"></span></div>
                <p class="live-stat-note">Range reflects recent Zillow ZHVI data · live figure loads when available · see the <a href="/#market" style="color:var(--gold);">full market table</a></p>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
                ${city.intro.map((p) => `<p class="lead">${esc(p)}</p>`).join("\n                ")}
                <div class="card-grid">
                    ${city.highlights.map((h) => `<div class="info-card"><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p></div>`).join("\n                    ")}
                </div>
            </div>
        </section>

        <section class="content-section alt">
            <div class="container">
                <div class="section-label">EDUCATION</div>
                <h2>Schools in ${city.name}</h2>
                <p class="lead"><strong>${esc(city.schools.district)}.</strong> ${esc(city.schools.blurb)}</p>
                <ul class="check-list">
                    ${city.schools.notable.map((s) => `<li>${esc(s)}</li>`).join("\n                    ")}
                </ul>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
                <div class="section-label">GETTING AROUND</div>
                <h2>Commute &amp; Connectivity</h2>
                <p class="lead">${esc(city.commute.blurb)}</p>
                <ul class="check-list">
                    ${city.commute.points.map((p) => `<li>${esc(p)}</li>`).join("\n                    ")}
                </ul>
            </div>
        </section>

        <section class="content-section alt">
            <div class="container">
                <div class="section-label">NEIGHBORHOODS</div>
                <h2>Where to Look in ${city.name}</h2>
                <div class="card-grid">
                    ${city.neighborhoods.map((n) => `<div class="info-card"><h3>${esc(n.name)}</h3><p>${esc(n.blurb)}</p></div>`).join("\n                    ")}
                </div>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
                <div class="section-label">INVESTOR LENS</div>
                <h2>${city.name} for Investors</h2>
                <p class="lead">${esc(city.investor)}</p>
                <p class="lead">Run the numbers yourself: <a href="/calculators/affordability/">affordability</a>, <a href="/calculators/buy-vs-rent/">buy vs rent</a>, and <a href="/calculators/property-tax/">property tax</a> calculators — or ask me for a full analysis on any property.</p>
                ${city.related.length ? `<p class="lead"><strong>Related reading:</strong> ${city.related.map((r) => `<a href="${r.href}">${esc(r.label)}</a>`).join(" · ")}</p>` : ""}
            </div>
        </section>
${faqHtml(city.faq)}
        <script>
        (function() {
          var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby67NfkUwnxnZLnLmp5O0X278VRwPsgYHJOZrEA20SIEBEv1U8M-urD-1gOiG5yE6oebg/exec';
          fetch(SCRIPT_URL + '?action=marketdata').then(function(r){return r.json();}).then(function(res) {
            if (!res.success || !res.data) return;
            var row = res.data.find(function(c){ return c.city === ${JSON.stringify(city.name)}; });
            if (row && row.medianPrice) {
              document.getElementById('live-median').textContent = ' · live: $' + Number(row.medianPrice).toLocaleString();
            }
          }).catch(function(){});
        })();
        </script>`;

  return layout({
    title,
    description: city.metaDescription,
    canonicalPath: path,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Cities", path: "/cities/" },
      { name: city.name, path },
    ],
    schemas,
    body,
  });
}

function citiesIndex() {
  const body = `
        <section class="page-hero" style="padding-top:24px;">
            <div class="container">
                <div class="section-label" style="color:var(--gold);">CITY GUIDES</div>
                <h1>East Bay City Guides</h1>
                <p class="tagline">Deep local guides to the 8 cities I serve — prices, schools, neighborhoods, commutes, and honest trade-offs.</p>
            </div>
        </section>
        <section class="content-section">
            <div class="container">
                <div class="hub-grid">
                    ${CITIES.map((c) => `<a class="hub-card" href="/cities/${c.slug}/">
                        <span class="hub-emoji">${c.emoji}</span>
                        <h3>${c.name}</h3>
                        <p>${esc(c.tagline)}</p>
                        <span class="hub-band">Median SFH: ${esc(c.priceBand)}</span>
                    </a>`).join("\n                    ")}
                </div>
            </div>
        </section>`;
  return layout({
    title: "East Bay City Guides — San Ramon, Pleasanton, Dublin & More | Homes With Manish",
    description:
      "Local guides to 8 East Bay cities: home prices, school districts, neighborhoods, commutes, and investment potential — from San Ramon to Mountain House.",
    canonicalPath: "/cities/",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Cities", path: "/cities/" },
    ],
    schemas: [],
    body,
  });
}

// ---------------------------------------------------------------------------
// Calculator pages
// ---------------------------------------------------------------------------

function calculatorPage(calc) {
  const path = `/calculators/${calc.slug}/`;
  const body = `
        <section class="page-hero" style="padding-top:24px;">
            <div class="container">
                <div class="section-label" style="color:var(--gold);">FREE TOOL</div>
                <h1>${esc(calc.title)}</h1>
                <p class="tagline">${esc(calc.short)}</p>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
                ${calc.intro.map((p) => `<p class="lead">${esc(p)}</p>`).join("\n                ")}

                <div class="calc-card">
                    <div class="calc-form-grid">
${calc.formHtml}
                    </div>
                    <div style="text-align:center;margin-top:26px;">
                        <button class="btn btn-primary btn-lg" id="calc-run">Calculate</button>
                    </div>
                    <div class="calc-results" id="calc-results">
${calc.resultsHtml}
                    </div>
                    <p style="text-align:center;font-size:.75rem;color:var(--gray-400);margin-top:14px;">Estimates only — not financial, tax, or lending advice. See methodology below.</p>
                </div>
            </div>
        </section>

        <section class="content-section alt">
            <div class="container">
                <div class="section-label">HOW IT WORKS</div>
                <h2>Methodology &amp; Assumptions</h2>
                <p class="lead">${esc(calc.methodology)}</p>
                <p class="lead"><strong>More tools:</strong> ${CALCULATORS.filter((c) => c.slug !== calc.slug).map((c) => `<a href="/calculators/${c.slug}/">${esc(c.short)}</a>`).join(" · ")}</p>
            </div>
        </section>
${faqHtml(calc.faq)}
        <script>
        (function() {
          function num(id) {
            var v = document.getElementById(id).value || '';
            return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;
          }
          function fmt(n) {
            return '$' + Math.round(n).toLocaleString();
          }
          function set(id, text) { document.getElementById(id).textContent = text; }
          function show() { document.getElementById('calc-results').style.display = 'block'; }
${calc.js}
          document.getElementById('calc-run').addEventListener('click', calc);
          document.querySelectorAll('.calc-form-grid input, .calc-form-grid select').forEach(function(el) {
            el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calc(); });
          });
        })();
        </script>`;

  return layout({
    title: `${calc.title} | Homes With Manish`,
    description: calc.metaDescription,
    canonicalPath: path,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Calculators", path: "/calculators/" },
      { name: calc.short, path },
    ],
    schemas: [
      faqSchema(calc.faq),
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: calc.title,
        url: `${SITE}${path}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
    body,
  });
}

function calculatorsIndex() {
  const body = `
        <section class="page-hero" style="padding-top:24px;">
            <div class="container">
                <div class="section-label" style="color:var(--gold);">FREE TOOLS</div>
                <h1>Real Estate Calculators</h1>
                <p class="tagline">Free, no-signup tools tuned for East Bay prices, California taxes, and Bay Area buying decisions.</p>
            </div>
        </section>
        <section class="content-section">
            <div class="container">
                <div class="hub-grid">
                    ${CALCULATORS.map((c) => `<a class="hub-card" href="/calculators/${c.slug}/">
                        <span class="hub-emoji">🧮</span>
                        <h3>${esc(c.short)}</h3>
                        <p>${esc(c.metaDescription)}</p>
                    </a>`).join("\n                    ")}
                </div>
            </div>
        </section>`;
  return layout({
    title: "Free Real Estate Calculators for East Bay Buyers | Homes With Manish",
    description:
      "Free calculators for East Bay home buyers and investors: affordability, buy vs rent, closing costs, California property tax, and down payment planning.",
    canonicalPath: "/calculators/",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Calculators", path: "/calculators/" },
    ],
    schemas: [],
    body,
  });
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

function write(relPath, html) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  console.log("wrote", relPath);
}

for (const city of CITIES) write(`cities/${city.slug}/index.html`, cityPage(city));
write("cities/index.html", citiesIndex());
for (const calc of CALCULATORS) write(`calculators/${calc.slug}/index.html`, calculatorPage(calc));
write("calculators/index.html", calculatorsIndex());

console.log(`\nDone: ${CITIES.length} city pages + ${CALCULATORS.length} calculators + 2 hubs.`);
console.log("Sitemap paths:");
console.log(["/cities/", ...CITIES.map((c) => `/cities/${c.slug}/`), "/calculators/", ...CALCULATORS.map((c) => `/calculators/${c.slug}/`)].join("\n"));
