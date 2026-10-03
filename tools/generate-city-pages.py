#!/usr/bin/env python3
"""
generate-city-pages.py — builds new city guide pages from cities-data-new.json.

Template mirrors the current on-disk city pages (monogram logo, full nav,
live-median script, FAQ schema). Does NOT touch existing pages.
Usage: python3 tools/generate-city-pages.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://homeswithmanish.com"

NAV = """    <header class="navbar" id="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/" class="nav-logo" aria-label="Homes With Manish - Home">
                    <img src="/images/logo-monogram.png" alt="Homes With Manish" height="48" width="48" style="height:48px;width:auto;">
                </a>
            </div>
            <nav class="nav-links"><a href="/#about">About</a><a href="/services/home-buyers/">Buy</a><a href="/services/home-sellers/">Sell</a><a href="/#home-loans">Home Loans</a><a href="/cities/">Cities</a><a href="/sold/">Sold</a><a href="/#market">Market Data</a><a href="/calculators/">Calculators</a><a href="/blog/">Blog</a><a href="/#contact" class="nav-cta">Get Free Consultation</a></nav>
            <button class="hamburger" id="hamburger" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
        </div>
    </header>
    <div class="mobile-menu" id="mobileMenu">
        <span class="mobile-close" id="mobileClose">✕</span>
        <a href="/#about">About</a>
        <a href="/services/home-buyers/">Buy</a>
        <a href="/services/home-sellers/">Sell</a>
        <a href="/#home-loans">Home Loans</a>
        <a href="/cities/">Cities</a>
        <a href="/sold/">Sold</a>
        <a href="/#market">Market Data</a>
        <a href="/calculators/">Calculators</a>
        <a href="/blog/">Blog</a>
        <a href="/#contact">Get Free Consultation</a>
    </div>"""

FOOTER = """    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <img src="/images/logo-monogram.png" alt="Homes With Manish" height="44" width="44" style="height:44px;width:auto;margin-bottom:12px;">
                    <p>Data-driven real estate expertise for buyers, sellers, and investors across the East Bay. Your trusted partner in finding home.</p>
                </div>
                <div>
                    <h4>Explore</h4>
                    <div class="footer-links">
                        <a href="/#about">About</a>
                        <a href="/cities/">City Guides</a><a href="/sold/">Sold Homes</a>
                        <a href="/calculators/">Calculators</a>
                        <a href="/blog/">Blog</a>
                        <a href="/#contact">Contact</a>
                    </div>
                </div>
                <div>
                    <h4>Cities</h4>
                    <div class="footer-links">
                        <a href="/cities/san-ramon/">San Ramon</a>
                        <a href="/cities/pleasanton/">Pleasanton</a>
                        <a href="/cities/danville/">Danville</a>
                        <a href="/cities/dublin/">Dublin</a>
                        <a href="/cities/livermore/">Livermore</a>
                    </div>
                </div>
                <div>
                    <h4>Calculators</h4>
                    <div class="footer-links">
                        <a href="/calculators/affordability/">How much house can I afford?</a>
                        <a href="/calculators/buy-vs-rent/">Should I buy or keep renting?</a>
                        <a href="/calculators/closing-costs/">What will I pay at closing?</a>
                        <a href="/calculators/property-tax/">What will my property taxes be?</a>
                        <a href="/calculators/down-payment/">How long until I can buy?</a>
                        <a href="/calculators/sell-to-net/">What should I list to net my goal?</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div>&copy; 2026 Homes With Manish. All rights reserved.<br>Manish Manoharlal Anand, CA DRE #02247006 | MOSO Real Estate, CA DRE #01771313 | 2195 Tully Road, San Jose, CA 95122<br>Loan Officer, NMLS #2873088 | LoanFactory, NMLS #320841 | Equal Housing Opportunity</div>
                <div class="footer-legal">
                    <a href="/privacy.html">Privacy Policy</a>
                    <a href="/terms.html">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>"""

PAGE_SCRIPTS = """    <script>
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
          if (icon) icon.textContent = open ? '+' : '\\u2212';
        });
      });
    })();
    </script>"""

STYLE = """    <style>
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
      .check-list li::before { content: "\\2713"; position: absolute; left: 0; color: var(--gold); font-weight: 700; }
      .cta-band { background: var(--navy); border-radius: 18px; padding: 44px 32px; text-align: center; color: var(--white); }
      .cta-band h2 { color: var(--white); font-family: var(--font-display); margin-bottom: 10px; }
      .cta-band p { color: var(--gray-400); margin-bottom: 22px; }
      .live-stat-note { font-size: .85rem; color: var(--gray-400); margin-top: 10px; }
      .breadcrumb-bar { padding: 96px 0 0; }
      .breadcrumb-bar ol { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 0; font-size: .85rem; color: var(--gray-400); }
      .breadcrumb-bar a { color: var(--gray-600); text-decoration: none; }
      .breadcrumb-bar li + li::before { content: "\\203A"; margin-right: 6px; color: var(--gray-400); }
    </style>"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def faq_json(faqs):
    items = []
    for q, a in faqs:
        items.append('        {\n          "@type": "Question",\n'
                     f'          "name": "{esc(q)}",\n'
                     '          "acceptedAnswer": {\n'
                     '            "@type": "Answer",\n'
                     f'            "text": "{esc(a)}"\n'
                     '          }\n        }')
    return ",\n".join(items)


def faq_html(faqs):
    out = []
    for q, a in faqs:
        out.append(f'''                    <div class="faq-item">
                        <button class="faq-toggle" aria-expanded="false"><span>{esc(q)}</span><span class="faq-icon">+</span></button>
                        <div class="faq-content">{esc(a)}</div>
                    </div>''')
    return "\n".join(out)


def city_page(c):
    slug, name = c["slug"], c["name"]
    url = f"{SITE}/cities/{slug}/"
    highlights = "\n".join(
        f'                    <div class="info-card"><h3>{esc(h["title"])}</h3><p>{esc(h["text"])}</p></div>'
        for h in c["highlights"])
    schools_list = "\n".join(f"                    <li>{esc(s)}</li>" for s in c["schools"]["notable"])
    commute_list = "\n".join(f"                    <li>{esc(x)}</li>" for x in c["commute"]["points"])
    hoods = "\n".join(
        f'                    <div class="info-card"><h3>{esc(n["name"])}</h3><p>{esc(n["blurb"])}</p></div>'
        for n in c["neighborhoods"])
    intro = "\n".join(f'                <p class="lead">{esc(p)}</p>' for p in c["intro"])

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <title>Living in {esc(name)}, CA | Real Estate Guide</title>
    <meta name="description" content="{esc(c['metaDescription'])}">
    <meta name="author" content="Manish Anand">
    <link rel="canonical" href="{url}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="Living in {esc(name)}, CA | Real Estate Guide">
    <meta property="og:description" content="{esc(c['ogDescription'])}">
    <meta property="og:image" content="{SITE}/og-image.png">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:image" content="{SITE}/og-image.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
{STYLE}
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-CK983XLXCC"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());
      gtag('config', 'G-CK983XLXCC');
    </script>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "{SITE}/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "Cities",
          "item": "{SITE}/cities/"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "{esc(name)}",
          "item": "{url}"
        }}
      ]
    }}
    </script>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
{faq_json(c['faq'])}
      ]
    }}
    </script>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Manish Anand",
      "url": "{SITE}",
      "telephone": "+1-408-707-5324",
      "areaServed": {{
        "@type": "City",
        "name": "{esc(name)}",
        "addressRegion": "CA"
      }}
    }}
    </script>
</head>
<body>
{NAV}
    <main>
        <div class="breadcrumb-bar">
            <div class="container">
                <nav aria-label="Breadcrumb"><ol>
                    <li><a href="/">Home</a></li>
                    <li><a href="/cities/">Cities</a></li>
                    <li><span aria-current="page">{esc(name)}</span></li>
                </ol></nav>
            </div>
        </div>

        <section class="page-hero" style="padding-top:24px;">
            <div class="container">
                <div class="section-label" style="color:var(--gold);">{esc(c['heroEmoji'])} CITY GUIDE</div>
                <h1>Living in {esc(name)}, California</h1>
                <p class="tagline">{esc(c['tagline'])}</p>
                <div class="price-band">Median SFH: {esc(c['priceBand'])} <span id="live-median"></span></div>
                <p class="live-stat-note">Range reflects recent Zillow ZHVI data &middot; live figure loads when available &middot; see the <a href="/#market" style="color:var(--gold);">full market table</a></p>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
{intro}
                <div class="card-grid">
{highlights}
                </div>
            </div>
        </section>

        <section class="content-section alt">
            <div class="container">
                <div class="section-label">EDUCATION</div>
                <h2>Schools in {esc(name)}</h2>
                <p class="lead"><strong>{esc(c['schools']['district'])}</strong> {esc(c['schools']['blurb'])}</p>
                <ul class="check-list">
{schools_list}
                </ul>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
                <div class="section-label">GETTING AROUND</div>
                <h2>Commute &amp; Connectivity</h2>
                <p class="lead">{esc(c['commute']['blurb'])}</p>
                <ul class="check-list">
{commute_list}
                </ul>
            </div>
        </section>

        <section class="content-section alt">
            <div class="container">
                <div class="section-label">NEIGHBORHOODS</div>
                <h2>Where to Look in {esc(name)}</h2>
                <div class="card-grid">
{hoods}
                </div>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
                <div class="section-label">INVESTOR LENS</div>
                <h2>{esc(name)} for Investors</h2>
                <p class="lead">{esc(c['investor'])}</p>
                <p class="lead">Run the numbers yourself: <a href="/calculators/affordability/">affordability</a>, <a href="/calculators/buy-vs-rent/">buy vs rent</a>, and <a href="/calculators/property-tax/">property tax</a> calculators &mdash; or ask me for a full analysis on any property.</p>
            </div>
        </section>

        <section class="content-section alt">
            <div class="container">
                <div class="section-label">FREQUENTLY ASKED</div>
                <h2>Common Questions</h2>
                <div class="faq-wrapper">
{faq_html(c['faq'])}
                </div>
            </div>
        </section>
        <script>
        (function() {{
          var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby67NfkUwnxnZLnLmp5O0X278VRwPsgYHJOZrEA20SIEBEv1U8M-urD-1gOiG5yE6oebg/exec';
          fetch(SCRIPT_URL + '?action=marketdata').then(function(r){{return r.json();}}).then(function(res) {{
            if (!res.success || !res.data) return;
            var row = res.data.find(function(x){{ return x.city === "{esc(name)}"; }});
            if (row && row.medianPrice) {{
              document.getElementById('live-median').textContent = ' &middot; live: $' + Number(row.medianPrice).toLocaleString();
            }}
          }}).catch(function(){{}});
        }})();
        </script>
        <section class="content-section">
            <div class="container">
                <div class="cta-band">
                    <h2>Let's Talk Strategy</h2>
                    <p>Free consultation, zero pressure &mdash; market analysis, financing guidance, and a plan built around your goals.</p>
                    <a href="/#contact" class="btn btn-primary btn-lg">Get Your Free Consultation</a>
                </div>
            </div>
        </section>
    </main>
{FOOTER}
{PAGE_SCRIPTS}
</body>
</html>
"""


def main():
    data_path = os.path.join(ROOT, "tools", "cities-data-new.json")
    with open(data_path, encoding="utf-8") as f:
        cities = json.load(f)
    for c in cities:
        out_dir = os.path.join(ROOT, "cities", c["slug"])
        os.makedirs(out_dir, exist_ok=True)
        out = os.path.join(out_dir, "index.html")
        if os.path.exists(out):
            print(f"SKIP (exists): cities/{c['slug']}/index.html")
            continue
        with open(out, "w", encoding="utf-8") as f:
            f.write(city_page(c))
        print(f"wrote cities/{c['slug']}/index.html")


if __name__ == "__main__":
    main()
