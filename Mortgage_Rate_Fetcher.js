/*
 * MORTGAGE RATE FETCHER - Google Apps Script
 * ================================================================
 *
 * Fetches weekly mortgage rates from Freddie Mac's Primary Mortgage
 * Market Survey (PMMS) and stores them in a "MortgageRates" sheet.
 *
 * DATA SOURCE: Freddie Mac PMMS CSV
 * https://www.freddiemac.com/pmms
 *
 * SETUP:
 * 1. Add this code to your Apps Script project
 * 2. Run setupMortgageRatesSheet() once
 * 3. Run fetchMortgageRates() to test
 * 4. Run setupMortgageRateTrigger() for weekly auto-updates
 * 5. Add the mortgagerates endpoint to doGet (see bottom)
 * 6. Re-deploy the web app as a new version
 */

const FREDDIE_MAC_URL = 'https://www.freddiemac.com/pmms/docs/PMMS_history.csv';
const MORTGAGE_RATES_SHEET = 'MortgageRates';

// ============================================================================
// FETCH FUNCTION
// ============================================================================

/**
 * Fetches the latest mortgage rates from Freddie Mac PMMS CSV.
 * Stores the last 52 weeks of data.
 */
function fetchMortgageRates() {
  Logger.log('Fetching mortgage rates from Freddie Mac PMMS...');

  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(MORTGAGE_RATES_SHEET);

  if (!sheet) {
    setupMortgageRatesSheet();
    sheet = ss.getSheetByName(MORTGAGE_RATES_SHEET);
  }

  try {
    const response = UrlFetchApp.fetch(FREDDIE_MAC_URL, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    const code = response.getResponseCode();
    Logger.log('HTTP ' + code + ' from Freddie Mac');

    if (code !== 200) {
      Logger.log('Failed to fetch PMMS data. Response: ' + response.getContentText().substring(0, 300));
      return;
    }

    const csvText = response.getContentText();
    Logger.log('CSV downloaded. Size: ' + csvText.length + ' bytes');

    const rates = parsePMMSData(csvText);

    if (rates.length === 0) {
      Logger.log('No valid rate data found in CSV');
      return;
    }

    writeMortgageRatesToSheet(sheet, rates);
    Logger.log('Mortgage rates updated. Latest: 30yr=' + rates[0].rate30 + '%, 15yr=' + rates[0].rate15 + '%');

  } catch (error) {
    Logger.log('Error fetching mortgage rates: ' + error.toString());
  }
}

// ============================================================================
// CSV PARSING
// ============================================================================

/**
 * Parses the Freddie Mac PMMS CSV.
 * CSV columns: date, pmms30, pmms30p, pmms15, pmms15p, pmms51, pmms51p, pmms51m, pmms51spread
 * Returns last 52 weeks of data, most recent first.
 */
function parsePMMSData(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 3) return [];

  var results = [];

  // Parse from the end (most recent data) up to 52 weeks
  for (var i = lines.length - 1; i >= 1 && results.length < 52; i--) {
    var line = lines[i].trim();
    if (!line) continue;

    var parts = line.split(',');
    if (parts.length < 4) continue;

    var dateStr = parts[0].trim().replace(/"/g, '');
    var rate30 = parseFloat(parts[1]);
    var rate15 = parseFloat(parts[3]);

    // Validate
    if (!dateStr || isNaN(rate30) || isNaN(rate15)) continue;
    if (rate30 < 1 || rate30 > 20 || rate15 < 1 || rate15 > 20) continue;

    // Parse date (format: M/D/YYYY)
    var dateParts = dateStr.split('/');
    if (dateParts.length !== 3) continue;

    var month = parseInt(dateParts[0]);
    var day = parseInt(dateParts[1]);
    var year = parseInt(dateParts[2]);

    if (year < 2020) continue; // Only keep recent data

    var formattedDate = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');

    results.push({
      date: formattedDate,
      rate30: rate30,
      rate15: rate15
    });
  }

  return results;
}

// ============================================================================
// SHEET OPERATIONS
// ============================================================================

function setupMortgageRatesSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(MORTGAGE_RATES_SHEET);

  if (sheet) {
    Logger.log('MortgageRates sheet already exists');
    return;
  }

  sheet = ss.insertSheet(MORTGAGE_RATES_SHEET);
  var headers = ['Date', '30-Year Fixed', '15-Year Fixed'];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0F1B2D')
    .setFontColor('#C9A96E');

  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setFrozenRows(1);

  Logger.log('MortgageRates sheet created');
}

function writeMortgageRatesToSheet(sheet, rates) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 3).clear();
  }

  var rows = rates.map(function(r) {
    return [r.date, r.rate30 / 100, r.rate15 / 100];
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 3).setValues(rows);
    sheet.getRange(2, 2, rows.length, 2).setNumberFormat('0.00%');
  }

  Logger.log('Wrote ' + rows.length + ' rate entries');
}

// ============================================================================
// API ENDPOINT
// ============================================================================

/**
 * Returns mortgage rate data for the website.
 * Add this to your doGet: if (action === 'mortgagerates') { ... }
 */
function handleMortgageRatesRequest() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(MORTGAGE_RATES_SHEET);

  if (!sheet || sheet.getLastRow() < 2) {
    return { success: false, error: 'No mortgage rate data available' };
  }

  var data = sheet.getRange(2, 1, Math.min(sheet.getLastRow() - 1, 52), 3).getValues();

  // Latest rates
  var latest = data[0];
  var previous = data.length > 1 ? data[1] : null;

  var rate30 = latest[1];
  var rate15 = latest[2];

  // If stored as percentage decimals (0.065), convert
  if (rate30 < 1) { rate30 = rate30 * 100; }
  if (rate15 < 1) { rate15 = rate15 * 100; }

  var change30 = previous ? rate30 - (previous[1] < 1 ? previous[1] * 100 : previous[1]) : 0;
  var change15 = previous ? rate15 - (previous[2] < 1 ? previous[2] * 100 : previous[2]) : 0;

  // Last 4 weeks for trend
  var trend = [];
  for (var i = 0; i < Math.min(4, data.length); i++) {
    var r30 = data[i][1];
    if (r30 < 1) r30 = r30 * 100;
    var r15 = data[i][2];
    if (r15 < 1) r15 = r15 * 100;
    trend.push({
      date: data[i][0],
      rate30: r30,
      rate15: r15
    });
  }

  return {
    success: true,
    data: {
      rate30: rate30,
      rate15: rate15,
      change30: Math.round(change30 * 100) / 100,
      change15: Math.round(change15 * 100) / 100,
      trend: trend,
      asOf: latest[0]
    }
  };
}

// ============================================================================
// TRIGGER
// ============================================================================

function setupMortgageRateTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'fetchMortgageRates') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Freddie Mac updates weekly on Thursdays
  ScriptApp.newTrigger('fetchMortgageRates')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.THURSDAY)
    .atHour(12)
    .create();

  Logger.log('Weekly mortgage rate trigger set for Thursdays at 12 PM');
}
