#!/usr/bin/env node
/**
 * prerender-market-data.js
 * ========================
 * Fetches the live data feeds (Zillow ZHVI, ZORI, Freddie Mac PMMS) from the
 * Google Apps Script web app and bakes the latest numbers into index.html as
 * static HTML. Crawlers and AI agents that don't run JavaScript then see real
 * numbers instead of "Loading...".
 *
 * The page's own JavaScript still re-fetches and re-renders on load, so human
 * visitors always see the freshest data. Re-run this script periodically
 * (e.g. monthly after the ZHVI refresh) to keep the static snapshot current.
 *
 * Usage: node tools/prerender-market-data.js
 * Idempotent: re-running replaces the previous snapshot in place.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby67NfkUwnxnZLnLmp5O0X278VRwPsgYHJOZrEA20SIEBEv1U8M-urD-1gOiG5yE6oebg/exec';
const INDEX = path.join(__dirname, '..', 'index.html');
const TODAY = new Date().toISOString().slice(0, 10);
const NOTE = `Static snapshot ${TODAY}; live JS re-renders on page load. Refresh: node tools/prerender-market-data.js`;

async function fetchJson(action, url, hops) {
  url = url || `${SCRIPT_URL}?action=${action}`;
  hops = hops || 0;
  const attempt = () => new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (hops > 4) return reject(new Error(`${action}: too many redirects`));
        res.resume();
        return resolve(fetchJson(action, res.headers.location, hops + 1));
      }
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j.success) resolve(j);
          else reject(new Error(`${action}: success=false`));
        } catch (e) {
          reject(new Error(`${action}: bad JSON (http ${res.statusCode}, body: ${body.slice(0, 120)})`));
        }
      });
    }).on('error', reject);
  });
  // Apps Script cold-starts can return transient HTML error pages; retry.
  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      return await attempt();
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 2500 * (i + 1)));
    }
  }
  throw lastErr;
}

// --- Formatting mirrors the page's own JS exactly ---

function fmtMoney(n) {
  return n ? '$' + Number(n).toLocaleString('en-US') : 'N/A';
}

function fmtPriceShort(price) {
  if (!price) return 'N/A';
  const num = Number(price);
  if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return '$' + Math.round(num / 1e3) + 'K';
  return '$' + num.toLocaleString('en-US');
}

function fmtChange(change) {
  if (change === null || change === '' || change === undefined) return { html: 'N/A', cls: '' };
  const num = parseFloat(change);
  if (num >= 0) return { html: '+' + num.toFixed(1) + '%', cls: 'trend-up' };
  return { html: num.toFixed(1) + '%', cls: 'trend-down' };
}

function fmtDate(d) {
  const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return String(d);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m[2]) - 1]} ${parseInt(m[3])}, ${m[1]}`;
}

const CITY_ICON = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';

function marketRows(cities) {
  return cities.map((c) => {
    const chg = fmtChange(c.priceChange);
    return `<tr><td>${c.city}</td><td>${fmtMoney(c.medianPrice)}</td><td>${c.daysOnMarket || 'N/A'}</td><td><span class="${chg.cls}">${chg.html}</span></td></tr>`;
  }).join('\n');
}

function areaCards(cities) {
  const delays = ['', ' fade-in-delay-1', ' fade-in-delay-2'];
  return cities.map((c, i) => {
    const chg = fmtChange(c.priceChange);
    const slug = String(c.city).toLowerCase().replace(/\s+/g, '-');
    return `<a class="area-card fade-in${delays[i % 3]}" href="cities/${slug}/" style="display:block;text-decoration:none;color:inherit;">` +
      `<h3><span class="area-emoji">${CITY_ICON}</span> ${c.city}</h3>` +
      `<div class="area-stat"><span class="stat-label">Median SFH</span><span class="stat-value">${fmtPriceShort(c.medianPrice)}</span></div>` +
      `<div class="area-stat"><span class="stat-label">Days on Market</span><span class="stat-value">${c.daysOnMarket || 'N/A'}</span></div>` +
      `<div class="area-stat"><span class="stat-label">YoY Change</span><span class="stat-value ${chg.cls}">${chg.html}</span></div>` +
      `<div style="margin-top:12px;color:var(--gold);font-size:.85rem;font-weight:600;">View city guide →</div></a>`;
  }).join('\n');
}

function rentalRows(cities) {
  return cities.map((c) => {
    const rent = c.monthlyRent ? '$' + Number(c.monthlyRent).toLocaleString('en-US') : 'N/A';
    let grossYield = 'N/A';
    let ptr = 'N/A';
    if (c.medianPrice && c.monthlyRent) {
      const annualRent = c.monthlyRent * 12;
      const y = (annualRent / c.medianPrice) * 100;
      ptr = String(Math.round(c.medianPrice / annualRent));
      const cls = y >= 4 ? 'trend-up' : y >= 3 ? '' : 'trend-down';
      grossYield = `<span class="${cls}">${y.toFixed(2)}%</span>`;
    }
    return `<tr><td>${c.city}</td><td>${fmtMoney(c.medianPrice)}</td><td>${rent}</td><td>${grossYield}</td><td>${ptr}</td></tr>`;
  }).join('\n');
}

// Replace the inner HTML of a container matched by openRe/closeRe.
// Uses a replacer function so $ in content (e.g. $1,587,275) stays literal.
function fillInner(html, openRe, closeRe, content) {
  const re = new RegExp(`(${openRe.source})[\\s\\S]*?(${closeRe.source})`);
  if (!re.test(html)) throw new Error(`Container not found: ${openRe.source}`);
  return html.replace(re, (match, g1, g2) => `${g1}\n<!-- ${NOTE} -->\n${content}\n${g2}`);
}

(async () => {
  const [market, rates, rental] = await Promise.all([
    fetchJson('marketdata'),
    fetchJson('mortgagerates'),
    fetchJson('rentaldata'),
  ]);

  let html = fs.readFileSync(INDEX, 'utf8');

  html = fillInner(html,
    /<tbody id="market-data-body">/, /<\/tbody>/,
    marketRows(market.data));

  html = fillInner(html,
    /<p id="market-data-attribution"[^>]*>/, /<\/p>/,
    `Last updated: ${market.lastUpdated} \u00B7 ${market.attribution || 'Data from Zillow ZHVI'}`);

  html = fillInner(html,
    /<div class="areas-grid" id="areas-grid">/, /<\/div>\n(\s*)<\/div>/,
    areaCards(market.data));

  html = fillInner(html,
    /<tbody id="rental-yield-body">/, /<\/tbody>/,
    rentalRows(rental.data));

  html = fillInner(html,
    /<p id="rental-yield-attribution"[^>]*>/, /<\/p>/,
    `Last updated: ${rental.lastUpdated} \u00B7 ${rental.attribution || 'Data from Zillow ZORI & ZHVI'}`);

  const d = rates.data;
  const chg = (v) => (v >= 0
    ? `<span style="color:#ef4444;">&#9650; +${Math.abs(v).toFixed(2)}% vs last week</span>`
    : `<span style="color:#22c55e;">&#9660; ${Math.abs(v).toFixed(2)}% vs last week</span>`);

  html = fillInner(html, /<div id="rate-30yr-value"[^>]*>/, /<\/div>/, `${d.rate30.toFixed(2)}%`);
  html = fillInner(html, /<div id="rate-15yr-value"[^>]*>/, /<\/div>/, `${d.rate15.toFixed(2)}%`);
  html = fillInner(html, /<div id="rate-30yr-change"[^>]*>/, /<\/div>/, chg(d.change30));
  html = fillInner(html, /<div id="rate-15yr-change"[^>]*>/, /<\/div>/, chg(d.change15));

  const trendHtml = d.trend.map((w) =>
    `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.08);"><span style="color:var(--gray-400);font-size:.85rem;">${fmtDate(w.date)}</span><span style="color:var(--white);font-weight:600;font-size:.85rem;">${w.rate30.toFixed(2)}%</span></div>`
  ).join('\n');
  html = fillInner(html, /<div id="rate-trend"[^>]*>/, /<\/div>/, trendHtml);

  html = fillInner(html,
    /<p id="rate-attribution"[^>]*>/, /<\/p>/,
    `As of ${fmtDate(d.asOf)} \u00B7 Source: Freddie Mac PMMS`);

  fs.writeFileSync(INDEX, html);
  console.log(`Prerendered market data into index.html (snapshot ${TODAY})`);
  console.log(`- ${market.data.length} market rows + area cards, ${rental.data.length} rental rows`);
  console.log(`- 30yr ${d.rate30.toFixed(2)}%, 15yr ${d.rate15.toFixed(2)}% as of ${fmtDate(d.asOf)}`);
})().catch((e) => { console.error('Prerender failed:', e.message); process.exit(1); });
