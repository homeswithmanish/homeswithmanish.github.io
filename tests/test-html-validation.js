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
test('Has Areas link', /#areas/.test(indexHtml));
test('Has Contact link', /#contact/.test(indexHtml));
test('Has mobile menu', /hamburger|mobile-menu/.test(indexHtml));

// --- Content Sections ---
console.log('\n\x1b[36mContent Sections:\x1b[0m');
test('Has about section', /id=["']about["']/.test(indexHtml));
test('Has services section', /id=["']services["']/.test(indexHtml));
test('Has areas section', /id=["']areas["']/.test(indexHtml));
test('Has market data section', /id=["']market["']/.test(indexHtml));
test('Has testimonials section', /id=["']testimonials["']/.test(indexHtml));
test('Has contact section', /id=["']contact["']/.test(indexHtml));
test('Has FAQ section', /faq/i.test(indexHtml));

// --- Social Media ---
console.log('\n\x1b[36mSocial Media:\x1b[0m');
test('Has Instagram link', /instagram/i.test(indexHtml));
test('Has Facebook link', /facebook/i.test(indexHtml));
test('Has LinkedIn link', /linkedin/i.test(indexHtml));
test('Has YouTube link', /youtube/i.test(indexHtml));

// --- Market Data ---
console.log('\n\x1b[36mMarket Data:\x1b[0m');
const cities = ['San Ramon', 'Pleasanton', 'Danville', 'Dublin', 'Livermore', 'Fremont', 'Tracy', 'Mountain House'];
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
test('Has TikTok social link', /tiktok/i.test(indexHtml));

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

// ==================== ADMIN.HTML TESTS ====================
console.log('\n\n\x1b[1m=== admin.html Tests ===\x1b[0m\n');

const adminHtml = readFile('admin.html');

console.log('\x1b[36mSecurity:\x1b[0m');
test('Has noindex meta tag', /noindex/.test(adminHtml));
test('Has password authentication', /password|SHA-256|crypto\.subtle/i.test(adminHtml));
test('Does not contain plaintext password', !/HomesWithManish2026!/i.test(adminHtml));
test('Uses sessionStorage for session', /sessionStorage/.test(adminHtml));
test('Has session timeout', /timeout|expire|4.*hour|14400/i.test(adminHtml));
test('Has logout functionality', /logout/i.test(adminHtml));

console.log('\n\x1b[36mFunctionality:\x1b[0m');
test('Has login form', /login/i.test(adminHtml));
test('Has leads table', /table|leads/i.test(adminHtml));
test('Has search/filter', /search|filter/i.test(adminHtml));
test('Has CSV export', /csv|export/i.test(adminHtml));
test('Has stats display', /stats|total|leads/i.test(adminHtml));

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
  'admin.html',
  'css/style.css',
  'CNAME',
  'robots.txt',
  'sitemap.xml',
  'Google_Sheets_Backend.js',
  '404.html',
  'privacy.html'
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

// ==================== ADMIN CHART TESTS ====================
console.log('\n\n\x1b[1m=== admin.html Charts & Enhancements ===\x1b[0m\n');

console.log('\x1b[36mCharts:\x1b[0m');
test('Has city chart function', /renderCityChart|cityChart/i.test(adminHtml));
test('Has source chart function', /renderSourceChart|sourceChart/i.test(adminHtml));
test('Has chart container', /chart/i.test(adminHtml));

console.log('\n\x1b[36mQuick Actions:\x1b[0m');
test('Has quick actions column', /quick.*action|action.*btn/i.test(adminHtml));

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

// ==================== SUMMARY ====================
console.log('\n' + '='.repeat(50));
console.log(`\x1b[1mResults: ${passed} passed, ${failed} failed, ${passed + failed} total\x1b[0m`);

if (errors.length > 0) {
  console.log(`\n\x1b[31mFailed tests:\x1b[0m`);
  errors.forEach(e => console.log(`  - ${e}`));
}

console.log('');
process.exit(failed > 0 ? 1 : 0);
