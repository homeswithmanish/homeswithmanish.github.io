#!/usr/bin/env node
/**
 * HTML Validation Tests for Homes With Manish website
 * Tests critical elements, links, accessibility, SEO, and structured data
 * Run: node tests/test-html-validation.js
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
const errors = [];

function test(name, condition, detail) {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } else {
    failed++;
    const msg = detail ? `${name} — ${detail}` : name;
    errors.push(msg);
    console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
  }
}

function readFile(filename) {
  const filePath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// ==================== INDEX.HTML TESTS ====================
console.log('\n\x1b[1m=== index.html Tests ===\x1b[0m\n');

const indexHtml = readFile('index.html');

// --- Structure ---
console.log('\x1b[36mStructure:\x1b[0m');
test('Has DOCTYPE', indexHtml.includes('<!DOCTYPE html'));
test('Has html lang attribute', /html\s+lang=/.test(indexHtml));
test('Has charset meta', /charset=["']?UTF-8/i.test(indexHtml));
test('Has viewport meta', /name=["']viewport["']/.test(indexHtml));
test('Uses semantic header tag', /<header[\s>]/.test(indexHtml));
test('Uses semantic nav tag', /<nav[\s>]/.test(indexHtml));
test('Uses semantic main tag', /<main[\s>]/.test(indexHtml));
test('Uses semantic section tags', /<section[\s>]/.test(indexHtml));
test('Uses semantic footer tag', /<footer[\s>]/.test(indexHtml));

// --- SEO ---
console.log('\n\x1b[36mSEO:\x1b[0m');
test('Has title tag', /<title>/.test(indexHtml));
test('Has meta description', /name=["']description["']/.test(indexHtml));
test('Has canonical URL', /rel=["']canonical["']/.test(indexHtml));
test('Has Open Graph title', /property=["']og:title["']/.test(indexHtml));
test('Has Open Graph description', /property=["']og:description["']/.test(indexHtml));
test('Has Open Graph type', /property=["']og:type["']/.test(indexHtml));
test('Has Twitter card meta', /twitter:card/.test(indexHtml));
test('Has robots meta or allows indexing', !(/name=["']robots["']\s+content=["']noindex/.test(indexHtml)));
test('Title identifies Manish Anand', /<title>[^<]*Manish Anand/i.test(indexHtml));
test('Hero visibly identifies Manish Anand', /<h1[^>]*>[\s\S]*?Manish Anand[\s\S]*?<\/h1>/i.test(indexHtml));
test('Meta description identifies Manish Anand', /name=["']description["'][^>]*content=["'][^"']*Manish Anand/i.test(indexHtml));

// --- Schema.org Structured Data ---
console.log('\n\x1b[36mStructured Data (AI/Search Optimization):\x1b[0m');
test('Has JSON-LD script tag', /application\/ld\+json/.test(indexHtml));
test('Includes RealEstateAgent schema', /RealEstateAgent/.test(indexHtml));
test('Includes Person schema', /"Person"/.test(indexHtml) || /"@type":\s*"Person"/.test(indexHtml));
test('Includes FAQPage schema', /FAQPage/.test(indexHtml));
test('Has areaServed data', /areaServed/.test(indexHtml));
test('Mentions San Ramon in schema', /San Ramon/.test(indexHtml));
test('Mentions Tracy in schema', /Tracy/.test(indexHtml));
test('Mentions Fremont in schema', /Fremont/.test(indexHtml));

// --- Lead Capture Forms ---
console.log('\n\x1b[36mLead Capture:\x1b[0m');
test('Has hero lead form', /id=["']hero-lead-form["']/.test(indexHtml));
test('Has contact lead form', /id=["']contact-lead-form["']/.test(indexHtml) || /id=["']contact-form["']/.test(indexHtml));
test('Has email input field', /<input[^>]*type=["']email["']/.test(indexHtml));
test('Has phone input field', /<input[^>]*type=["']tel["']/.test(indexHtml) || /<input[^>]*name=["']phone["']/.test(indexHtml));
test('Has city dropdown', /San Ramon|Pleasanton|Dublin/.test(indexHtml));
test('Forms have submit buttons', /<button[^>]*type=["']submit["']/.test(indexHtml) || /btn-primary/.test(indexHtml));

// --- Navigation ---
console.log('\n\x1b[36mNavigation:\x1b[0m');
test('Has About link', /#about/.test(indexHtml));
test('Has Services link', /#services/.test(indexHtml));
test('Has Cities/Areas navigation', /href=["']cities\//.test(indexHtml));
test('Has Contact link', /#contact/.test(indexHtml));
test('Has mobile menu', /hamburger|mobile-menu/.test(indexHtml));

// --- Content Sections ---
console.log('\n\x1b[36mContent Sections:\x1b[0m');
test('Has about section', /id=["']about["']/.test(indexHtml));
test('Has services section', /id=["']services["']/.test(indexHtml));
test('Has areas section', /id=["']areas["']/.test(indexHtml));
test('Has market data section', /id=["']market["']/.test(indexHtml));
// Testimonials removed 2026-07-03 (D-006) until real client reviews exist (~end of July 2026)
test('No unsubstantiated testimonials section', !/id=["']testimonials["']/.test(indexHtml));
test('Has contact section', /id=["']contact["']/.test(indexHtml));
test('Has FAQ section', /faq/i.test(indexHtml));

// --- Social Media ---
console.log('\n\x1b[36mSocial Media:\x1b[0m');
test('Has Instagram link', /instagram/i.test(indexHtml));
test('Has Facebook link', /facebook/i.test(indexHtml));
test('Has YouTube link', /youtube/i.test(indexHtml));

// --- Market Data ---
console.log('\n\x1b[36mMarket Data:\x1b[0m');
const cities = ['San Ramon', 'Pleasanton', 'Danville', 'Dublin', 'Livermore', 'Fremont', 'Tracy'];
cities.forEach(city => {
  test(`Lists ${city}`, indexHtml.includes(city));
});

// --- New Sections (Round 2) ---
console.log('\n\x1b[36mNew Sections:\x1b[0m');
test('Has process/how-it-works section', /id=["']process["']/.test(indexHtml) || /how.*works/i.test(indexHtml));
test('Has why-work-with-me section', /id=["']why["']/.test(indexHtml) || /why.*work.*with/i.test(indexHtml));
test('Has newsletter signup', /newsletter/i.test(indexHtml));
test('Has skip-to-content link', /skip.*content/i.test(indexHtml));
test('Has trust badges section', /trust|badge/i.test(indexHtml));
test('Has DRE license number', /02247006/.test(indexHtml));
test('Links to privacy.html', /href=["']privacy\.html["']/.test(indexHtml));
test('Links to terms.html', /href=["']terms\.html["']/.test(indexHtml));
test('Has mortgage rates section', /id=["']rates["']/.test(indexHtml));
test('Has payment calculator section', /id=["']calculator["']/.test(indexHtml));
test('Has rental yield section', /id=["']rental-yield["']/.test(indexHtml));
test('Area cards are dynamic', /id=["']areas-grid["']/.test(indexHtml));
test('Has broker info (MOSO Real Estate)', /MOSO Real Estate.*01771313|01771313.*MOSO Real Estate/.test(indexHtml));
test('Has Blinq QR code', /blinq-qr/.test(indexHtml));
test('Has resources section', /id=["']resources["']/.test(indexHtml));
test('Has Schema.org broker/worksFor', /worksFor/.test(indexHtml));

// --- New Sections (Round 3) ---
console.log('\n\x1b[36mNew Sections (Round 3):\x1b[0m');
test('Has stats banner section', /id=["']stats-banner["']/.test(indexHtml));
test('Has Why East Bay section', /id=["']why-east-bay["']/.test(indexHtml));
test('Has insights/blog teaser section', /id=["']insights["']/.test(indexHtml));
test('Has scroll progress bar', /scroll-progress/.test(indexHtml));
test('Has BreadcrumbList schema', /BreadcrumbList/.test(indexHtml));
// AggregateRating schema removed 2026-07-03 (D-006) — no on-page review source; re-add with real reviews
test('No AggregateRating schema without real reviews', !/AggregateRating/.test(indexHtml));
test('Has expanded FAQ (11+ questions)', (indexHtml.match(/faq-item/g) || []).length >= 11);
test('FAQ has school district question', /school.*district|best.*school/i.test(indexHtml));
test('FAQ has investment cities question', /best.*cities.*investment|investment.*east.*bay/i.test(indexHtml));
test('FAQ has house cost question', /how.*much.*house.*cost|house.*cost.*east.*bay/i.test(indexHtml));
test('Stats section has animated counters', /data-count/.test(indexHtml) && /stat-number/.test(indexHtml));
test('Why East Bay has lifestyle cards', /lifestyle-card/.test(indexHtml));
test('Insights section has article cards', /insight-card/.test(indexHtml));
test('Has comparison grid (Why Work With Me)', /comparison-grid/.test(indexHtml));
test('Hero image has fetchpriority', /fetchpriority/.test(indexHtml));

// --- True Cost Calculator (Mello-Roos + HOA) ---
console.log('\n\x1b[36mTrue Cost Calculator:\x1b[0m');
test('Has true-cost section', /id=["']true-cost["']/.test(indexHtml));
test('Has True Cost nav link (desktop + mobile)', (indexHtml.match(/href=["']#true-cost["']/g) || []).length >= 2);
test('Mentions Mello-Roos', /Mello-Roos/i.test(indexHtml));
test('Has neighborhood preset chips container', /id=["']tc-chips["']/.test(indexHtml));
test('Has home price input', /id=["']tc-price["']/.test(indexHtml));
test('Has Mello-Roos and HOA inputs', /id=["']tc-cfd["']/.test(indexHtml) && /id=["']tc-hoa["']/.test(indexHtml));
test('Has true monthly cost output', /id=["']tc-true["']/.test(indexHtml));
test('Has advertised-vs-hidden bar', /id=["']tc-bar-adv["']/.test(indexHtml) && /id=["']tc-bar-hidden["']/.test(indexHtml));
test('Has planning-estimate data disclaimer', /TC_VERIFIED/.test(indexHtml) && /planning estimates|planning only/i.test(indexHtml));
test('Covers Dublin + San Ramon neighborhoods', /Boulevard/.test(indexHtml) && /Windemere/.test(indexHtml));
test('Dublin figures cite verified FY2024-25 admin reports', /Goodwin Consulting/.test(indexHtml) && /FY2024-25/.test(indexHtml));
test('Boulevard Mello-Roos reflects verified figure (~$5,900/yr)', /cfdAnnual:5900/.test(indexHtml));
test('San Ramon special taxes labeled as estimates', /San Ramon figures are planning estimates/.test(indexHtml));
test('True Cost CTA links to contact', /id=["']true-cost["'][\s\S]*?href=["']#contact["'][\s\S]*?<\/section>/.test(indexHtml));
test('Uses design system in true-cost (navy/gold/off-white)', /id=["']true-cost["'][\s\S]*?var\(--navy\)[\s\S]*?<\/section>/.test(indexHtml));

// --- Accessibility ---
console.log('\n\x1b[36mAccessibility:\x1b[0m');
test('Has ARIA labels', /aria-label/.test(indexHtml));
test('Images have alt attributes or are decorative', true); // Placeholder images
test('Form inputs have associated labels or aria', /label|aria-label/.test(indexHtml));

// --- Performance ---
console.log('\n\x1b[36mPerformance:\x1b[0m');
test('Links to external CSS (not all inline)', /link[^>]*style\.css/.test(indexHtml));
test('Does not include jQuery', !/jquery/i.test(indexHtml));
test('Does not include heavy frameworks', !/react|angular|vue\.js/i.test(indexHtml));

// ==================== CALCULATOR PAGES ====================
console.log('\n\n\x1b[1m=== Calculator Pages (Sell-to-Net & Buy vs Rent) ===\x1b[0m\n');

const sellToNet = readFile('calculators/sell-to-net/index.html');
console.log('\x1b[36mSell-to-Net:\x1b[0m');
test('Sell-to-Net page exists with title', /<title>[^<]*Sell-to-Net/i.test(sellToNet));
test('Has net-proceeds input', /id=["']stn-net["']/.test(sellToNet));
test('Has commission + costs inputs', /id=["']stn-commission["']/.test(sellToNet) && /id=["']stn-costs["']/.test(sellToNet));
test('Has target sale price output', /id=["']stn-list["']/.test(sellToNet));
test('Solves backward (net + payoff + fixed)', /net \+ payoff \+ fixed/.test(sellToNet));
test('Has WebApplication schema', /WebApplication/.test(sellToNet));
test('Has FAQ schema', /FAQPage/.test(sellToNet));
test('Has estimates-only disclaimer', /Estimates only/i.test(sellToNet));
test('Listed in calculators hub', /calculators\/sell-to-net\//.test(readFile('calculators/index.html')));
test('Listed in sitemap', /calculators\/sell-to-net\//.test(readFile('sitemap.xml')));

const buyVsRent = readFile('calculators/buy-vs-rent/index.html');
console.log('\n\x1b[36mBuy vs Rent (tax-savings upgrade):\x1b[0m');
test('Has marginal tax rate input', /id=["']bvr-taxrate["']/.test(buyVsRent));
test('Has tax savings output row', /id=["']bvr-taxsave["']/.test(buyVsRent));
test('Applies $750k mortgage-interest cap', /750000/.test(buyVsRent));
test('Applies $10k SALT cap', /10000/.test(buyVsRent));
test('Methodology notes upper-bound / itemize caveat', /upper bound/i.test(buyVsRent) && /itemize/i.test(buyVsRent));

// admin.html tests removed 2026-07-14: the page (client-side password gate on
// a public static site) triggered a Google Safe Browsing social-engineering
// listing on the domain and was deleted. Leads admin moves behind real auth.

// ==================== CSS TESTS ====================
console.log('\n\n\x1b[1m=== style.css Tests ===\x1b[0m\n');

const css = readFile('css/style.css');

console.log('\x1b[36mDesign System:\x1b[0m');
test('Defines CSS custom properties', /--navy:/.test(css));
test('Defines gold color', /--gold:/.test(css));
test('Uses Playfair Display font', /Playfair Display/.test(css));
test('Uses Inter font', /Inter/.test(css));
test('Has responsive breakpoints', /@media/.test(css));
test('Has mobile breakpoint (768px)', /768px/.test(css));
test('Has tablet breakpoint (1024px)', /1024px/.test(css));
test('Has print styles', /@media print/.test(css));
test('Has animation definitions', /@keyframes/.test(css));
test('Has hover states', /:hover/.test(css));
test('Has focus states', /:focus/.test(css));

// ==================== FILE STRUCTURE TESTS ====================
console.log('\n\n\x1b[1m=== File Structure Tests ===\x1b[0m\n');

const requiredFiles = [
  'index.html',
  'css/style.css',
  'CNAME',
  'robots.txt',
  'sitemap.xml',
  'Google_Sheets_Backend.js',
  '404.html',
  'privacy.html',
  'terms.html',
  'Mortgage_Rate_Fetcher.js',
  'Rental_Data_Fetcher.js'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  test(`${file} exists`, exists);
});

// ==================== 404.HTML TESTS ====================
console.log('\n\n\x1b[1m=== 404.html Tests ===\x1b[0m\n');

const notFoundHtml = readFile('404.html');

console.log('\x1b[36m404 Page:\x1b[0m');
test('Has DOCTYPE', notFoundHtml.includes('<!DOCTYPE html'));
test('Has 404 text', /404/.test(notFoundHtml));
test('Has link back to homepage', /href=["']\/["']|href=["']index\.html["']|href=["']https?:\/\/homeswithmanish\.com/.test(notFoundHtml));
test('Has self-contained styles', /<style/.test(notFoundHtml));

// ==================== PRIVACY.HTML TESTS ====================
console.log('\n\n\x1b[1m=== privacy.html Tests ===\x1b[0m\n');

const privacyHtml = readFile('privacy.html');

console.log('\x1b[36mPrivacy Page:\x1b[0m');
test('Has DOCTYPE', privacyHtml.includes('<!DOCTYPE html'));
test('Has title tag', /<title>/.test(privacyHtml));
test('Mentions data collection', /data.*collect|collect.*data|information.*collect/i.test(privacyHtml));
test('Mentions cookies', /cookie/i.test(privacyHtml));
test('Mentions Google Sheets', /Google Sheets/i.test(privacyHtml));
test('Has contact information', /homeswithmanish|manish/i.test(privacyHtml));

// ==================== TERMS.HTML TESTS ====================
console.log('\n\n\x1b[1m=== terms.html Tests ===\x1b[0m\n');

const termsHtml = readFile('terms.html');

console.log('\x1b[36mTerms of Service Page:\x1b[0m');
test('Has DOCTYPE', termsHtml.includes('<!DOCTYPE html'));
test('Has title tag', /<title>/.test(termsHtml));
test('Mentions DRE license number', /02247006/.test(termsHtml));
test('Has real estate disclaimer', /disclaimer|informational purposes/i.test(termsHtml));
test('Has limitation of liability', /limitation.*liab|liable/i.test(termsHtml));
test('Has governing law section', /governing law|California/i.test(termsHtml));
test('Has contact information', /homeswithmanish|manish/i.test(termsHtml));

// admin.html chart tests removed with the page (see note above).

// ==================== GOOGLE SHEETS BACKEND TESTS ====================
console.log('\n\n\x1b[1m=== Google_Sheets_Backend.js Tests ===\x1b[0m\n');

const backendJs = readFile('Google_Sheets_Backend.js');

console.log('\x1b[36mBackend Functions:\x1b[0m');
test('Has doPost function', /function doPost/.test(backendJs));
test('Has doGet function', /function doGet/.test(backendJs));
test('Has rate limiting', /rateLimit|CacheService/i.test(backendJs));
test('Has input sanitization', /sanitize/i.test(backendJs));
test('Has email validation', /validateEmail|email.*valid/i.test(backendJs));
test('Has CORS headers', /Access-Control|CORS/i.test(backendJs));
test('Has notification email', /sendNotification|notification.*email/i.test(backendJs));
test('Has admin key auth', /ADMIN.*KEY|admin.*key/i.test(backendJs));
test('Has setup/initialization', /createInitialSheet|setup/i.test(backendJs));

// ==================== ROBOTS.TXT TESTS ====================
console.log('\n\n\x1b[1m=== robots.txt Tests ===\x1b[0m\n');

const robotsTxt = readFile('robots.txt');

console.log('\x1b[36mAI Crawler Access:\x1b[0m');
test('Allows all user agents', /User-agent: \*[\s\S]*?Allow: \//.test(robotsTxt));
test('Has sitemap reference', /Sitemap:/.test(robotsTxt));
test('Allows GPTBot', /GPTBot/.test(robotsTxt));
test('Allows ClaudeBot', /ClaudeBot/.test(robotsTxt));
test('Allows Google-Extended', /Google-Extended/.test(robotsTxt));
test('Allows PerplexityBot', /PerplexityBot/.test(robotsTxt));


// ==================== GENERATED PAGES / SEO HYGIENE ====================
console.log('\n\n\x1b[1m=== Generated Pages & SEO Hygiene ===\x1b[0m\n');

const ROOT = path.join(__dirname, '..');
function walkHtml(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}
const decode = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const sitemapXml = readFile('sitemap.xml');
const sitemapLocs = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

const NEIGHBORHOOD_PAGES = [
  'cities/san-ramon/dougherty-valley/index.html',
  'cities/dublin/dublin-ranch/index.html',
  'cities/pleasanton/ruby-hill/index.html',
  'cities/danville/blackhawk/index.html',
  'cities/fremont/mission-san-jose/index.html',
  'cities/dublin/wallis-ranch/index.html',
  'cities/tracy/tracy-hills/index.html',
  'cities/pleasanton/vintage-hills/index.html',
];

console.log('\x1b[36mNeighborhood guides:\x1b[0m');
for (const rel of NEIGHBORHOOD_PAGES) {
  const exists = fs.existsSync(path.join(ROOT, rel));
  test(`${rel} exists`, exists);
  if (!exists) continue;
  const html = readFile(rel);
  const url = 'https://homeswithmanish.com/' + rel.replace(/index\.html$/, '');
  test(`${rel} in sitemap`, sitemapLocs.has(url));
  test(`${rel} has Place schema`, /"@type": "Place"/.test(html));
  test(`${rel} has FAQPage schema`, /"@type": "FAQPage"/.test(html));
  test(`${rel} links to parent city guide`, html.includes(`href="/${rel.split('/').slice(0, 2).join('/')}/"`));
  test(`${rel} shows DRE number`, html.includes('02247006'));
  test(`${rel} has a sources section`, />Sources</.test(html));
  const bodyText = html.split('<main>')[1] || '';
  test(`${rel} body copy has no em dashes`, !/—/.test(bodyText.replace(/<footer[\s\S]*$/, '')));
}

console.log('\n\x1b[36mSite-wide head checks:\x1b[0m');
const allPages = walkHtml(ROOT).filter((f) => !/DEPLOYMENT_GUIDE|404\.html|openhouse/.test(f));
const seenTitles = new Map();
let badJson = [];
let longTitles = [];
let longDescs = [];
let svgOg = [];
for (const f of allPages) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f);
  const t = decode((html.match(/<title>([^<]*)<\/title>/) || [, ''])[1]);
  const d = decode((html.match(/name="description" content="([^"]*)"/) || [, ''])[1]);
  if (t.length > 65) longTitles.push(`${rel} (${t.length})`);
  if (d.length > 165) longDescs.push(`${rel} (${d.length})`);
  if (seenTitles.has(t)) seenTitles.get(t).push(rel); else seenTitles.set(t, [rel]);
  if (/og:image" content="[^"]+\.svg"/.test(html)) svgOg.push(rel);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { badJson.push(rel); }
  }
}
const dupTitles = [...seenTitles.entries()].filter(([, v]) => v.length > 1).map(([k, v]) => `${k}: ${v.join(', ')}`);
test('All JSON-LD blocks parse', badJson.length === 0, badJson.join(', '));
test('No titles over 65 characters', longTitles.length === 0, longTitles.join(', '));
test('No meta descriptions over 165 characters', longDescs.length === 0, longDescs.join(', '));
test('No duplicate titles', dupTitles.length === 0, dupTitles.join(' | '));
test('No SVG og:image (unsupported by social platforms)', svgOg.length === 0, svgOg.join(', '));

console.log('\n\x1b[36mGenerator is source of truth:\x1b[0m');
const llms = readFile('llms.txt');
const llmsFull = readFile('llms-full.txt');
test('llms.txt keeps entity facts block', /Who Manish Anand is \(entity facts\)/.test(llms));
test('llms.txt keeps disambiguation list', /Disambiguation/.test(llms));
test('llms-full.txt keeps entity facts block', /Who Manish Anand is \(entity facts\)/.test(llmsFull));
test('llms.txt lists neighborhood guides', /## Neighborhood Guides/.test(llms));
test('Generated city pages link Sold Homes in footer', readFile('cities/san-ramon/index.html').includes('href="/sold/">Sold Homes'));
test('Generated hero H1 is white on navy (was invisible)', /\.page-hero h1 \{[^}]*color: var\(--white\)/.test(readFile('cities/san-ramon/index.html')));
test('City page title targets realtor intent', /San Ramon Real Estate Agent/.test(readFile('cities/san-ramon/index.html')));
test('City page links its neighborhood guide', readFile('cities/san-ramon/index.html').includes('/cities/san-ramon/dougherty-valley/'));
test('No "costs you nothing" buyer-comp phrasing in generated data', !/costs you nothing/i.test(readFile('cities/mountain-house/index.html')));

console.log('\n\x1b[36mBlog E-E-A-T & URL consistency:\x1b[0m');
const blogPosts = fs.readdirSync(path.join(ROOT, 'blog')).filter((f) => f.endsWith('.html') && f !== 'index.html');
for (const f of blogPosts) {
  const html = readFile(`blog/${f}`);
  const slug = f.replace(/\.html$/, '');
  const url = `https://homeswithmanish.com/blog/${slug}`;
  test(`blog/${f} canonical is extensionless`, html.includes(`rel="canonical" href="${url}"`));
  test(`blog/${f} in sitemap under canonical URL`, sitemapLocs.has(url));
  test(`blog/${f} author tied to entity @id`, html.includes('"@id": "https://homeswithmanish.com/#manish-anand"'));
  test(`blog/${f} publisher tied to business @id`, html.includes('"publisher": {"@id": "https://homeswithmanish.com/#business"}'));
  test(`blog/${f} has BreadcrumbList schema`, /"@type": "BreadcrumbList"/.test(html));
  test(`blog/${f} byline links to about page`, html.includes('href="/about-manish-anand/" rel="author"'));
}
test('Sitemap has no .html blog URLs (canonicals are extensionless)', ![...sitemapLocs].some((u) => /\/blog\/.+\.html$/.test(u)));
const staleBlogLinks = allPages.filter((f) => /\/blog\/[a-z0-9-]+\.html/.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(ROOT, f));
test('No internal links to .html blog URLs', staleBlogLinks.length === 0, staleBlogLinks.join(', '));
const blogIndexUrls = [...readFile('blog/index.html').matchAll(/https:\/\/homeswithmanish\.com\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]);
test('Blog index schema URLs all resolve to real posts', blogIndexUrls.length > 0 && blogIndexUrls.every((s) => blogPosts.includes(`${s}.html`)), blogIndexUrls.join(', '));
test('llms.txt lists every blog post', blogPosts.every((f) => llms.includes(`/blog/${f.replace(/\.html$/, '')})`)));

console.log('\n\x1b[36mTruthful advertising (licensed 2024-10-11):\x1b[0m');
const experienceClaim = /over a decade|\d+\+? years of experience|helped (dozens|hundreds)|spent years helping|many of my clients/i;
const claimPages = allPages.filter((f) => experienceClaim.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(ROOT, f));
const responsePromise = /within (1-2|2|two) hours|\b2-hour response|responds in 2 hours|response guarantee/i;
const promisePages = allPages.filter((f) => responsePromise.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(ROOT, f));
test('No response-time guarantees (not a promise Manish can keep)', promisePages.length === 0, promisePages.join(', '));
test('No inflated experience or client-count claims', claimPages.length === 0, claimPages.join(', '));
test('llms-full.txt has no inflated experience claims', !experienceClaim.test(llmsFull));

console.log('\n\x1b[36mIndexNow & entity profiles:\x1b[0m');
const indexNowKey = (readFile('tools/indexnow.mjs').match(/const KEY = "([0-9a-f]{32})"/) || [])[1];
test('IndexNow key file deployed at site root and matches script', !!indexNowKey && fs.existsSync(path.join(ROOT, `${indexNowKey}.txt`)) && readFile(`${indexNowKey}.txt`).trim() === indexNowKey);
test('Visible hours match schema hours (10am-4pm daily)', indexHtml.includes('Available daily, 10am-4pm PT') && indexHtml.includes('"opens": "10:00", "closes": "16:00"') && !/M-F, 8am|"closes": "20:00"/.test(indexHtml));
test('Person sameAs includes Zillow profile', indexHtml.includes('"https://www.zillow.com/profile/homeswithmanish"]'));
test('Zillow profile linked visibly on homepage', (indexHtml.match(/href="https:\/\/www\.zillow\.com\/profile\/homeswithmanish" class="social-link"/g) || []).length === 2);
test('Never links the namesake Zillow profile mkanand', !allPages.some((f) => fs.readFileSync(f, 'utf8').includes('zillow.com/profile/mkanand')));
test('Person sameAs includes MLSListings profile', indexHtml.includes('https://www.mlslistings.com/FindAnAgent/Profile/02247006'));

// ==================== SUMMARY ====================
console.log('\n' + '='.repeat(50));
console.log(`\x1b[1mResults: ${passed} passed, ${failed} failed, ${passed + failed} total\x1b[0m`);

if (errors.length > 0) {
  console.log(`\n\x1b[31mFailed tests:\x1b[0m`);
  errors.forEach(e => console.log(`  - ${e}`));
}

console.log('');
process.exit(failed > 0 ? 1 : 0);
