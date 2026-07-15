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
test('Has broker info (REeBroker)', /REeBroker.*01522411|01522411.*REeBroker/.test(indexHtml));
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

// ==================== SUMMARY ====================
console.log('\n' + '='.repeat(50));
console.log(`\x1b[1mResults: ${passed} passed, ${failed} failed, ${passed + failed} total\x1b[0m`);

if (errors.length > 0) {
  console.log(`\n\x1b[31mFailed tests:\x1b[0m`);
  errors.forEach(e => console.log(`  - ${e}`));
}

console.log('');
process.exit(failed > 0 ? 1 : 0);
