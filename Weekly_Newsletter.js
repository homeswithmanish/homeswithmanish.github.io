/*
 * WEEKLY NEWSLETTER GENERATOR — Google Apps Script
 * ================================================================
 * Auto-generates a branded weekly market update email as a Gmail draft
 * every Monday. Pulls LIVE data from your MarketData, MortgageRates,
 * and RentalData sheets — no manual data entry needed.
 *
 * All newsletter subscribers are BCC'd. You review the draft, then
 * click Send — one button.
 *
 * ADD TO YOUR EXISTING APPS SCRIPT PROJECT:
 * 1. Open your Google Apps Script project
 * 2. Click "+" next to Files → Script → Name it "Weekly_Newsletter"
 * 3. Paste this entire file
 * 4. Run setupWeeklyNewsletter() once to create the trigger
 *
 * HOW IT WORKS:
 * - Every Monday at 8 AM, generates a branded HTML email
 * - Reads all active subscribers from the "Newsletter" sheet
 * - Pulls real-time market data, mortgage rates, rental data
 * - Creates a Gmail draft with subscribers BCC'd
 * - You open the draft, review, and click Send
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Uses SHEET_ID, NOTIFICATION_EMAIL from Google_Sheets_Backend.js
// Uses NEWSLETTER_SHEET_NAME, getActiveSubscribers() from Google_Sheets_Backend.js

const BRAND = {
  navy: '#0F1B2D',
  gold: '#C9A96E',
  white: '#FFFFFF',
  gray: '#f5f5f5',
  darkGray: '#555555',
  lightGray: '#888888',
  name: 'Manish Anand',
  title: 'Licensed REALTOR® | DRE #02247006',
  brokerage: 'REeBroker Group | DRE #01522411',
  phone: '(408) 707-5324',
  email: 'homeswithmanish@gmail.com',
  website: 'https://homeswithmanish.com',
  instagram: 'https://www.instagram.com/homeswithmanish/',
  facebook: 'https://www.facebook.com/profile.php?id=61572276856121',
  youtube: 'https://www.youtube.com/@HomesWithManish'
};

// ============================================================================
// MAIN NEWSLETTER GENERATOR
// ============================================================================

/**
 * Generates a branded weekly market update email draft.
 * Pulls live data from all three data sheets and creates
 * a Gmail draft addressed to all active subscribers via BCC.
 */
function generateWeeklyNewsletter() {
  Logger.log('Generating weekly newsletter...');

  // 1. Get subscribers
  const subscribers = getActiveSubscribers();
  if (subscribers.length === 0) {
    Logger.log('No active subscribers found. Skipping newsletter generation.');
    return;
  }
  Logger.log('Found ' + subscribers.length + ' active subscriber(s)');

  // 2. Pull live data
  const marketData = getMarketDataForNewsletter();
  const mortgageData = getMortgageDataForNewsletter();
  const rentalData = getRentalDataForNewsletter();

  // 3. Build date strings
  const now = new Date();
  const weekOf = Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMMM d, yyyy');
  const monthYear = Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMMM yyyy');

  // 4. Generate email HTML
  const subject = 'East Bay Market Update — Week of ' + weekOf;
  const htmlBody = buildNewsletterHtml(marketData, mortgageData, rentalData, weekOf, monthYear);

  // 5. Create draft with all subscribers in BCC
  const bccList = subscribers.map(s => s.email).join(',');

  GmailApp.createDraft(
    BRAND.email,                    // "To" is yourself (so you see it)
    subject,
    'Your weekly East Bay market update is ready. View this email in a modern email client for the best experience.',
    {
      htmlBody: htmlBody,
      bcc: bccList,
      name: 'Manish Anand — Homes With Manish',
      replyTo: BRAND.email
    }
  );

  Logger.log('Newsletter draft created with ' + subscribers.length + ' BCC recipients');
  Logger.log('Subject: ' + subject);
  Logger.log('Open Gmail > Drafts to review and send');
}

// ============================================================================
// DATA PULLERS — Read live data from sheets
// ============================================================================

/**
 * Reads market data from the MarketData sheet.
 * Returns array of city objects sorted by median price descending.
 */
function getMarketDataForNewsletter() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('MarketData');

  if (!sheet || sheet.getLastRow() < 2) {
    Logger.log('MarketData sheet empty or missing');
    return [];
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
  // Columns: City, MedianPrice, PricePerSqft, HomesSold, DaysOnMarket, Inventory, PriceChange, LastUpdated, Source

  return data.map(row => ({
    city: row[0],
    medianPrice: row[1],
    pricePerSqft: row[2],
    homesSold: row[3],
    daysOnMarket: row[4],
    inventory: row[5],
    priceChange: row[6],
    lastUpdated: row[7]
  })).filter(d => d.city); // Filter out blank rows
}

/**
 * Reads latest mortgage rates from the MortgageRates sheet.
 * Returns object with current rates and weekly change.
 */
function getMortgageDataForNewsletter() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('MortgageRates');

  if (!sheet || sheet.getLastRow() < 2) {
    Logger.log('MortgageRates sheet empty or missing');
    return { rate30: 'N/A', rate15: 'N/A', change30: 0, change15: 0, asOf: 'N/A' };
  }

  const data = sheet.getRange(2, 1, Math.min(sheet.getLastRow() - 1, 4), 3).getValues();
  // Columns: Date, 30YrRate, 15YrRate

  const latest = data[0];
  const previous = data.length > 1 ? data[1] : null;

  let rate30 = latest[1];
  let rate15 = latest[2];
  if (rate30 < 1) rate30 = rate30 * 100;
  if (rate15 < 1) rate15 = rate15 * 100;

  let change30 = 0, change15 = 0;
  if (previous) {
    let prev30 = previous[1]; if (prev30 < 1) prev30 *= 100;
    let prev15 = previous[2]; if (prev15 < 1) prev15 *= 100;
    change30 = Math.round((rate30 - prev30) * 100) / 100;
    change15 = Math.round((rate15 - prev15) * 100) / 100;
  }

  return {
    rate30: Math.round(rate30 * 100) / 100,
    rate15: Math.round(rate15 * 100) / 100,
    change30: change30,
    change15: change15,
    asOf: latest[0]
  };
}

/**
 * Reads rental data from the RentalData sheet.
 * Returns array of city rental objects.
 */
function getRentalDataForNewsletter() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('RentalData');

  if (!sheet || sheet.getLastRow() < 2) {
    Logger.log('RentalData sheet empty or missing');
    return [];
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
  // Columns: City, MonthlyRent, MedianPrice, GrossYield, PriceToRent, LastUpdated, Source

  return data.map(row => {
    let grossYield = row[3];
    if (grossYield && typeof grossYield === 'number' && grossYield < 1) {
      grossYield = grossYield * 100;
    }
    return {
      city: row[0],
      monthlyRent: row[1],
      medianPrice: row[2],
      grossYield: grossYield ? Math.round(grossYield * 100) / 100 : null,
      priceToRent: row[4]
    };
  }).filter(d => d.city);
}

// ============================================================================
// HTML EMAIL BUILDER
// ============================================================================

/**
 * Builds the complete branded HTML newsletter email.
 */
function buildNewsletterHtml(marketData, mortgageData, rentalData, weekOf, monthYear) {

  // --- Helper: format price ---
  function fmtPrice(val) {
    if (!val && val !== 0) return 'N/A';
    if (typeof val === 'string') return val;
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return '$' + Math.round(val / 1000) + 'K';
    return '$' + val;
  }

  function fmtRent(val) {
    if (!val && val !== 0) return 'N/A';
    if (typeof val === 'string') return val;
    return '$' + Math.round(val).toLocaleString();
  }

  function fmtPct(val) {
    if (!val && val !== 0) return 'N/A';
    if (typeof val === 'string') return val;
    var sign = val >= 0 ? '+' : '';
    return sign + (typeof val === 'number' ? val.toFixed(1) : val) + '%';
  }

  function changeColor(val) {
    if (!val) return BRAND.darkGray;
    var num = typeof val === 'string' ? parseFloat(val) : val;
    return num > 0 ? '#27ae60' : num < 0 ? '#e74c3c' : BRAND.darkGray;
  }

  function changeArrow(val) {
    if (!val) return '';
    var num = typeof val === 'string' ? parseFloat(val) : val;
    return num > 0 ? '&#9650;' : num < 0 ? '&#9660;' : '&#9654;';
  }

  // --- Build market data table rows ---
  var marketRows = '';
  if (marketData.length > 0) {
    marketData.forEach(function(city) {
      var pctColor = changeColor(city.priceChange);
      marketRows += '<tr>' +
        '<td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;color:' + BRAND.navy + ';">' + city.city + '</td>' +
        '<td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">' + fmtPrice(city.medianPrice) + '</td>' +
        '<td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">' + (city.daysOnMarket || 'N/A') + '</td>' +
        '<td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">' + (city.inventory || 'N/A') + '</td>' +
        '<td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;color:' + pctColor + ';font-weight:600;">' +
          changeArrow(city.priceChange) + ' ' + fmtPct(city.priceChange) +
        '</td>' +
      '</tr>';
    });
  } else {
    marketRows = '<tr><td colspan="5" style="padding:16px;text-align:center;color:#888;">Market data not yet available</td></tr>';
  }

  // --- Build rental data rows ---
  var rentalRows = '';
  if (rentalData.length > 0) {
    rentalData.forEach(function(city) {
      rentalRows += '<tr>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:' + BRAND.navy + ';">' + city.city + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">' + fmtRent(city.monthlyRent) + '/mo</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">' + fmtPrice(city.medianPrice) + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;color:' + BRAND.gold + ';font-weight:600;">' +
          (city.grossYield ? city.grossYield.toFixed(1) + '%' : 'N/A') +
        '</td>' +
      '</tr>';
    });
  } else {
    rentalRows = '<tr><td colspan="4" style="padding:16px;text-align:center;color:#888;">Rental data not yet available</td></tr>';
  }

  // --- Mortgage rate change arrows ---
  var rate30Arrow = mortgageData.change30 > 0 ? '&#9650;' : mortgageData.change30 < 0 ? '&#9660;' : '';
  var rate15Arrow = mortgageData.change15 > 0 ? '&#9650;' : mortgageData.change15 < 0 ? '&#9660;' : '';
  var rate30Color = mortgageData.change30 > 0 ? '#e74c3c' : mortgageData.change30 < 0 ? '#27ae60' : BRAND.darkGray;
  var rate15Color = mortgageData.change15 > 0 ? '#e74c3c' : mortgageData.change15 < 0 ? '#27ae60' : BRAND.darkGray;

  // --- Assemble full email ---
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>' +
  '<body style="margin:0;padding:0;background:#f5f5f5;font-family:\'Helvetica Neue\',Arial,sans-serif;color:#333;">' +

  // Wrapper
  '<div style="max-width:640px;margin:0 auto;background:#fff;">' +

  // ==================== HEADER ====================
  '<div style="background:' + BRAND.navy + ';padding:32px 40px;text-align:center;">' +
    '<h1 style="color:' + BRAND.gold + ';margin:0;font-size:22px;font-weight:600;letter-spacing:0.5px;">HOMES WITH MANISH</h1>' +
    '<p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:12px;letter-spacing:1px;">WEEKLY EAST BAY MARKET UPDATE</p>' +
  '</div>' +

  // ==================== DATE BAR ====================
  '<div style="background:' + BRAND.gold + ';padding:10px 40px;text-align:center;">' +
    '<p style="margin:0;font-size:13px;font-weight:600;color:' + BRAND.navy + ';">Week of ' + weekOf + '</p>' +
  '</div>' +

  // ==================== INTRO ====================
  '<div style="padding:32px 40px 16px;">' +
    '<p style="font-size:15px;line-height:1.6;color:' + BRAND.darkGray + ';margin:0 0 16px;">Hi there,</p>' +
    '<p style="font-size:15px;line-height:1.6;color:' + BRAND.darkGray + ';margin:0;">Here\'s your weekly snapshot of the East Bay housing market — real numbers from live data, updated automatically from Zillow, Freddie Mac, and Redfin.</p>' +
  '</div>' +

  // ==================== MORTGAGE RATES ====================
  '<div style="padding:16px 40px 24px;">' +
    '<h2 style="color:' + BRAND.navy + ';font-size:16px;margin:0 0 16px;padding-bottom:8px;border-bottom:2px solid ' + BRAND.gold + ';">Mortgage Rates</h2>' +
    '<div style="display:flex;gap:16px;">' +

      // 30-year card
      '<div style="flex:1;background:' + BRAND.gray + ';border-radius:8px;padding:20px;text-align:center;">' +
        '<p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:' + BRAND.lightGray + ';">30-Year Fixed</p>' +
        '<p style="margin:0;font-size:28px;font-weight:700;color:' + BRAND.navy + ';">' + mortgageData.rate30 + '%</p>' +
        '<p style="margin:4px 0 0;font-size:12px;color:' + rate30Color + ';">' + rate30Arrow + ' ' + (mortgageData.change30 >= 0 ? '+' : '') + mortgageData.change30 + ' pts vs last week</p>' +
      '</div>' +

      // 15-year card
      '<div style="flex:1;background:' + BRAND.gray + ';border-radius:8px;padding:20px;text-align:center;">' +
        '<p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:' + BRAND.lightGray + ';">15-Year Fixed</p>' +
        '<p style="margin:0;font-size:28px;font-weight:700;color:' + BRAND.navy + ';">' + mortgageData.rate15 + '%</p>' +
        '<p style="margin:4px 0 0;font-size:12px;color:' + rate15Color + ';">' + rate15Arrow + ' ' + (mortgageData.change15 >= 0 ? '+' : '') + mortgageData.change15 + ' pts vs last week</p>' +
      '</div>' +

    '</div>' +
    '<p style="font-size:11px;color:#aaa;margin:8px 0 0;">Source: Freddie Mac PMMS' + (mortgageData.asOf !== 'N/A' ? ' as of ' + mortgageData.asOf : '') + '</p>' +
  '</div>' +

  // ==================== MARKET DATA TABLE ====================
  '<div style="padding:8px 40px 24px;">' +
    '<h2 style="color:' + BRAND.navy + ';font-size:16px;margin:0 0 16px;padding-bottom:8px;border-bottom:2px solid ' + BRAND.gold + ';">Home Prices by City</h2>' +
    '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
      '<thead>' +
        '<tr style="background:' + BRAND.navy + ';">' +
          '<th style="padding:10px 12px;text-align:left;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">City</th>' +
          '<th style="padding:10px 12px;text-align:right;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">Median Price</th>' +
          '<th style="padding:10px 12px;text-align:center;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">DOM</th>' +
          '<th style="padding:10px 12px;text-align:center;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">Inventory</th>' +
          '<th style="padding:10px 12px;text-align:right;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">YoY</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' + marketRows + '</tbody>' +
    '</table>' +
    '<p style="font-size:11px;color:#aaa;margin:8px 0 0;">Source: Zillow ZHVI / Redfin</p>' +
  '</div>' +

  // ==================== RENTAL YIELDS ====================
  '<div style="padding:8px 40px 24px;">' +
    '<h2 style="color:' + BRAND.navy + ';font-size:16px;margin:0 0 16px;padding-bottom:8px;border-bottom:2px solid ' + BRAND.gold + ';">Rental Yields</h2>' +
    '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
      '<thead>' +
        '<tr style="background:' + BRAND.navy + ';">' +
          '<th style="padding:8px 12px;text-align:left;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">City</th>' +
          '<th style="padding:8px 12px;text-align:right;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">Rent</th>' +
          '<th style="padding:8px 12px;text-align:right;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">Home Price</th>' +
          '<th style="padding:8px 12px;text-align:right;color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;">Gross Yield</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' + rentalRows + '</tbody>' +
    '</table>' +
    '<p style="font-size:11px;color:#aaa;margin:8px 0 0;">Source: Zillow ZORI & ZHVI</p>' +
  '</div>' +

  // ==================== CTA ====================
  '<div style="padding:8px 40px 32px;">' +
    '<div style="background:linear-gradient(135deg,' + BRAND.navy + ' 0%,#1a2d47 100%);border-radius:12px;padding:28px;text-align:center;">' +
      '<p style="color:' + BRAND.gold + ';font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 8px;">PERSONALIZED FOR YOU</p>' +
      '<h3 style="color:#fff;margin:0 0 12px;font-size:18px;">Want a custom analysis for your target city?</h3>' +
      '<p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 20px;">Reply to this email with your criteria and I\'ll send you a detailed breakdown — free, no obligation.</p>' +
      '<a href="' + BRAND.website + '#contact" style="display:inline-block;background:' + BRAND.gold + ';color:' + BRAND.navy + ';text-decoration:none;padding:12px 32px;border-radius:6px;font-weight:600;font-size:14px;">Book a Free Consultation</a>' +
    '</div>' +
  '</div>' +

  // ==================== FREE GUIDES ====================
  '<div style="padding:0 40px 32px;">' +
    '<div style="background:' + BRAND.gray + ';border-radius:8px;padding:20px;">' +
      '<p style="font-size:13px;font-weight:600;color:' + BRAND.navy + ';margin:0 0 12px;">Free Guides for Subscribers:</p>' +
      '<p style="font-size:13px;margin:6px 0;"><a href="' + BRAND.website + '/guides/First-Time-Buyer-Checklist.pdf" style="color:' + BRAND.gold + ';text-decoration:none;font-weight:500;">First-Time Buyer Checklist</a> — Pre-approval to closing day</p>' +
      '<p style="font-size:13px;margin:6px 0;"><a href="' + BRAND.website + '/guides/East-Bay-Investment-Guide.pdf" style="color:' + BRAND.gold + ';text-decoration:none;font-weight:500;">East Bay Investment Guide</a> — Cash flow analysis by city</p>' +
      '<p style="font-size:13px;margin:6px 0;"><a href="' + BRAND.website + '/guides/Relocating-to-East-Bay.pdf" style="color:' + BRAND.gold + ';text-decoration:none;font-weight:500;">Relocating to East Bay</a> — Schools, commutes, cost of living</p>' +
    '</div>' +
  '</div>' +

  // ==================== SIGN-OFF ====================
  '<div style="padding:0 40px 32px;">' +
    '<div style="border-top:1px solid #eee;padding-top:24px;">' +
      '<p style="font-size:14px;color:' + BRAND.darkGray + ';line-height:1.6;margin:0;">' +
        'Best regards,<br>' +
        '<strong style="color:' + BRAND.navy + ';">' + BRAND.name + '</strong><br>' +
        BRAND.title + '<br>' +
        '<a href="tel:4087075324" style="color:' + BRAND.gold + ';text-decoration:none;">' + BRAND.phone + '</a> | ' +
        '<a href="mailto:' + BRAND.email + '" style="color:' + BRAND.gold + ';text-decoration:none;">' + BRAND.email + '</a><br>' +
        '<a href="' + BRAND.website + '" style="color:' + BRAND.gold + ';text-decoration:none;">homeswithmanish.com</a>' +
      '</p>' +
    '</div>' +
  '</div>' +

  // ==================== FOOTER ====================
  '<div style="background:' + BRAND.navy + ';padding:20px 40px;text-align:center;">' +
    '<p style="font-size:11px;color:rgba(255,255,255,0.4);margin:0 0 8px;">' + BRAND.brokerage + '</p>' +
    '<p style="font-size:11px;color:rgba(255,255,255,0.4);margin:0 0 8px;">Serving San Ramon, Pleasanton, Danville, Dublin, Livermore, Fremont, Tracy & Mountain House</p>' +
    '<p style="font-size:11px;color:rgba(255,255,255,0.3);margin:0;">To unsubscribe, reply with "UNSUBSCRIBE" in the subject line.</p>' +
  '</div>' +

  '</div>' + // End wrapper
  '</body></html>';

  return html;
}

// ============================================================================
// SETUP — Run once
// ============================================================================

/**
 * Sets up the weekly newsletter trigger.
 * Run this ONCE from the Apps Script editor.
 * Creates a trigger that runs generateWeeklyNewsletter() every Monday at 8 AM.
 */
function setupWeeklyNewsletter() {
  // Remove any existing newsletter triggers
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'generateWeeklyNewsletter') {
      ScriptApp.deleteTrigger(trigger);
      Logger.log('Removed existing newsletter trigger');
    }
  });

  // Create new weekly trigger — Monday at 8 AM
  ScriptApp.newTrigger('generateWeeklyNewsletter')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();

  Logger.log('========================================');
  Logger.log('WEEKLY NEWSLETTER SETUP COMPLETE');
  Logger.log('========================================');
  Logger.log('Newsletter will be drafted every Monday at ~8 AM');
  Logger.log('Open Gmail > Drafts to review and click Send');
  Logger.log('========================================');

  // Run an immediate test generation
  Logger.log('Generating test newsletter draft now...');
  generateWeeklyNewsletter();
}

/**
 * Manually generate a newsletter draft (useful for testing or ad-hoc sends).
 */
function manualNewsletterDraft() {
  Logger.log('Manually generating newsletter draft...');
  generateWeeklyNewsletter();
}
