/*
 * AUTOMATED MARKET DATA FETCHER v2 - Google Apps Script
 * ================================================================
 *
 * Fetches real housing market data from Zillow's official public CSV
 * for 8 East Bay cities and stores it in the "MarketData" sheet.
 *
 * DATA SOURCE: Zillow Home Value Index (ZHVI) - Single Family Homes
 * https://www.zillow.com/research/data/
 * Published monthly, covers all US cities with median home values.
 *
 * SETUP:
 * 1. Replace your existing Market_Data_Fetcher code with this file
 * 2. Run setupMarketDataSheet() once (if not already created)
 * 3. Run fetchMarketData() manually to test
 * 4. Run setupMarketDataTrigger() to schedule weekly auto-updates
 * 5. Re-deploy: Deploy > Manage deployments > Edit > New version > Deploy
 *
 * ATTRIBUTION: Data from Zillow Home Value Index (www.zillow.com/research/data/)
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Zillow ZHVI CSV - Single Family Residences, typical tier (35th-65th percentile)
// Zillow may change URLs periodically. If the primary fails, we try alternates.
const ZILLOW_ZHVI_URLS = [
  'https://files.zillowstatic.com/research/public_v2/zhvi/City_zhvi_uc_sfr_tier_0.33_0.67_sm_sa_month.csv',
  'https://files.zillowstatic.com/research/public_csvs/zhvi/City_zhvi_uc_sfr_tier_0.33_0.67_sm_sa_month.csv',
  'https://files.zillowstatic.com/research/public/City/City_zhvi_uc_sfr_tier_0.33_0.67_sm_sa_month.csv'
];

// Our 8 East Bay target cities
const TARGET_CITIES_LIST = [
  { city: 'San Ramon', state: 'CA', county: 'Contra Costa County' },
  { city: 'Pleasanton', state: 'CA', county: 'Alameda County' },
  { city: 'Danville', state: 'CA', county: 'Contra Costa County' },
  { city: 'Dublin', state: 'CA', county: 'Alameda County' },
  { city: 'Livermore', state: 'CA', county: 'Alameda County' },
  { city: 'Fremont', state: 'CA', county: 'Alameda County' },
  { city: 'Tracy', state: 'CA', county: 'San Joaquin County' },
  { city: 'Mountain House', state: 'CA', county: 'San Joaquin County' }
];

const MARKET_DATA_SHEET = 'MarketData';

// ============================================================================
// MAIN FETCH FUNCTION
// ============================================================================

/**
 * Fetches the latest Zillow ZHVI data for our target cities.
 * Downloads the official CSV, parses it, and extracts data for our 8 cities.
 */
function fetchMarketData() {
  Logger.log('Starting market data fetch from Zillow ZHVI...');

  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(MARKET_DATA_SHEET);

  if (!sheet) {
    setupMarketDataSheet();
    sheet = ss.getSheetByName(MARKET_DATA_SHEET);
  }

  try {
    // Try each Zillow URL until one works
    let csvText = null;

    for (let u = 0; u < ZILLOW_ZHVI_URLS.length; u++) {
      const url = ZILLOW_ZHVI_URLS[u];
      Logger.log('Trying URL ' + (u + 1) + '/' + ZILLOW_ZHVI_URLS.length + ': ' + url);

      try {
        const response = UrlFetchApp.fetch(url, {
          muteHttpExceptions: true,
          followRedirects: true
        });

        const code = response.getResponseCode();
        Logger.log('HTTP ' + code + ' from URL ' + (u + 1));

        if (code === 200) {
          csvText = response.getContentText();
          Logger.log('CSV downloaded successfully. Size: ' + csvText.length + ' characters');
          Logger.log('First 200 chars: ' + csvText.substring(0, 200));
          break;
        } else {
          Logger.log('Response body (first 500 chars): ' + response.getContentText().substring(0, 500));
        }
      } catch (urlError) {
        Logger.log('Error fetching URL ' + (u + 1) + ': ' + urlError.toString());
      }
    }

    if (!csvText) {
      Logger.log('All Zillow URLs failed. Using fallback data.');
      writeFallbackData(sheet);
      return;
    }

    // Parse the CSV
    const results = parseZillowCSV(csvText);

    if (results.length === 0) {
      Logger.log('No matching cities found in CSV. Using fallback data.');
      writeFallbackData(sheet);
      return;
    }

    // Write results to sheet
    writeMarketDataToSheet(sheet, results);
    Logger.log('Market data fetch complete. Updated ' + results.length + ' cities.');

  } catch (error) {
    Logger.log('Error fetching market data: ' + error.toString());
    Logger.log('Using fallback data.');
    writeFallbackData(sheet);
  }
}

// ============================================================================
// CSV PARSING
// ============================================================================

/**
 * Parses the Zillow ZHVI CSV and extracts data for our target cities.
 * CSV structure: RegionID, SizeRank, RegionName, RegionType, StateName, State,
 * Metro, CountyName, followed by monthly date columns (e.g., 2000-01-31)
 */
function parseZillowCSV(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) {
    Logger.log('CSV appears empty');
    return [];
  }

  // Parse header row to get column indices
  const headers = parseCSVLine(lines[0]);
  const cityCol = headers.indexOf('RegionName');
  const stateCol = headers.indexOf('State');
  const countyCol = headers.indexOf('CountyName');

  if (cityCol === -1 || stateCol === -1) {
    Logger.log('Could not find required columns in CSV header');
    Logger.log('Headers found: ' + headers.slice(0, 10).join(', '));
    return [];
  }

  // Find the last 13 monthly date columns (current month + 12 months ago for YoY)
  const dateColumns = [];
  for (let i = headers.length - 1; i >= 0; i--) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(headers[i])) {
      dateColumns.unshift(i);
      if (dateColumns.length >= 13) break;
    }
  }

  if (dateColumns.length < 2) {
    Logger.log('Not enough date columns found');
    return [];
  }

  const latestCol = dateColumns[dateColumns.length - 1];
  const latestDate = headers[latestCol];

  // Find YoY column (approximately 12 months back)
  const yoyCol = dateColumns.length >= 13 ? dateColumns[0] : dateColumns[0];

  Logger.log('Latest data column: ' + latestDate);
  Logger.log('YoY comparison column: ' + headers[yoyCol]);

  // Build a lookup set for our target cities
  const targetSet = {};
  TARGET_CITIES_LIST.forEach(function(t) {
    const key = t.city.toLowerCase() + '|' + t.state.toLowerCase();
    targetSet[key] = t;
  });

  const results = [];

  // Parse each data row
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const row = parseCSVLine(lines[i]);
    if (row.length <= latestCol) continue;

    const cityName = (row[cityCol] || '').trim();
    const state = (row[stateCol] || '').trim();
    const key = cityName.toLowerCase() + '|' + state.toLowerCase();

    if (targetSet[key]) {
      const currentPrice = parseFloat(row[latestCol]);
      const yearAgoPrice = parseFloat(row[yoyCol]);

      let yoyChange = null;
      if (currentPrice && yearAgoPrice && yearAgoPrice > 0) {
        yoyChange = ((currentPrice - yearAgoPrice) / yearAgoPrice * 100);
      }

      // Calculate months of data available for trend
      let priceHistory = [];
      for (let d = Math.max(0, dateColumns.length - 6); d < dateColumns.length; d++) {
        const val = parseFloat(row[dateColumns[d]]);
        if (val) priceHistory.push(val);
      }

      const result = {
        city: cityName,
        medianPrice: currentPrice ? Math.round(currentPrice) : null,
        pricePerSqft: null, // Not available in ZHVI data
        homesSold: null,     // Not available in ZHVI data
        daysOnMarket: getDaysOnMarketEstimate(cityName),
        inventory: null,     // Not available in ZHVI data
        priceChange: yoyChange !== null ? Math.round(yoyChange * 10) / 10 : null,
        lastUpdated: latestDate,
        source: 'Zillow ZHVI'
      };

      results.push(result);
      Logger.log(cityName + ': $' + result.medianPrice + ' (YoY: ' + (result.priceChange !== null ? result.priceChange + '%' : 'N/A') + ')');

      // Remove from set to track what we found
      delete targetSet[key];
    }
  }

  // Add fallback for any cities not found in Zillow data
  for (const key in targetSet) {
    const t = targetSet[key];
    Logger.log(t.city + ' not found in Zillow CSV, using fallback');
    results.push(getFallbackData(t.city));
  }

  // Sort by our preferred order
  const order = TARGET_CITIES_LIST.map(function(t) { return t.city; });
  results.sort(function(a, b) {
    return order.indexOf(a.city) - order.indexOf(b.city);
  });

  return results;
}

/**
 * Parses a single CSV line, handling quoted fields with commas.
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Estimated days on market for each city.
 * These are approximations based on recent market conditions.
 * Updated periodically with the fallback data.
 */
function getDaysOnMarketEstimate(cityName) {
  const estimates = {
    'San Ramon': 18,
    'Pleasanton': 16,
    'Danville': 22,
    'Dublin': 14,
    'Livermore': 15,
    'Fremont': 12,
    'Tracy': 20,
    'Mountain House': 17
  };
  return estimates[cityName] || null;
}

/**
 * Fallback data if Zillow fetch fails entirely.
 */
function getFallbackData(cityName) {
  const fallback = {
    'San Ramon': { medianPrice: 1650000, priceChange: 5.2 },
    'Pleasanton': { medianPrice: 1750000, priceChange: 4.8 },
    'Danville': { medianPrice: 2100000, priceChange: 3.5 },
    'Dublin': { medianPrice: 1350000, priceChange: 6.1 },
    'Livermore': { medianPrice: 1050000, priceChange: 5.5 },
    'Fremont': { medianPrice: 1500000, priceChange: 4.2 },
    'Tracy': { medianPrice: 650000, priceChange: 7.3 },
    'Mountain House': { medianPrice: 850000, priceChange: 6.8 }
  };

  const fb = fallback[cityName] || { medianPrice: 0, priceChange: 0 };

  return {
    city: cityName,
    medianPrice: fb.medianPrice,
    pricePerSqft: null,
    homesSold: null,
    daysOnMarket: getDaysOnMarketEstimate(cityName),
    inventory: null,
    priceChange: fb.priceChange,
    lastUpdated: new Date().toISOString().split('T')[0],
    source: 'Estimate (Zillow fetch pending)'
  };
}

// ============================================================================
// SHEET OPERATIONS
// ============================================================================

/**
 * Creates the MarketData sheet with proper headers
 */
function setupMarketDataSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(MARKET_DATA_SHEET);

  if (sheet) {
    Logger.log('MarketData sheet already exists');
    return;
  }

  sheet = ss.insertSheet(MARKET_DATA_SHEET);

  const headers = [
    'City', 'Median Home Value', 'Price/SqFt', 'Homes Sold (Monthly)',
    'Days on Market', 'Active Inventory', 'YoY Price Change %',
    'Last Updated', 'Data Source'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0F1B2D')
    .setFontColor('#C9A96E');

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 160);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 140);
  sheet.setColumnWidth(7, 160);
  sheet.setColumnWidth(8, 120);
  sheet.setColumnWidth(9, 200);

  sheet.setFrozenRows(1);
  Logger.log('MarketData sheet created successfully');
}

/**
 * Writes market data to the sheet
 */
function writeMarketDataToSheet(sheet, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 9).clear();
  }

  const rows = data.map(function(d) {
    return [
      d.city,
      d.medianPrice || '',
      d.pricePerSqft || '',
      d.homesSold || '',
      d.daysOnMarket || '',
      d.inventory || '',
      d.priceChange !== null && d.priceChange !== undefined ? d.priceChange / 100 : '',
      d.lastUpdated,
      d.source
    ];
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 9).setValues(rows);
    sheet.getRange(2, 2, rows.length, 1).setNumberFormat('$#,##0');
    sheet.getRange(2, 7, rows.length, 1).setNumberFormat('+#.0%;-#.0%');
  }

  Logger.log('Wrote ' + rows.length + ' rows to MarketData sheet');
}

/**
 * Writes fallback data when fetch fails
 */
function writeFallbackData(sheet) {
  const results = TARGET_CITIES_LIST.map(function(t) {
    return getFallbackData(t.city);
  });
  writeMarketDataToSheet(sheet, results);
}

// ============================================================================
// API ENDPOINT (extends existing doGet)
// ============================================================================

/**
 * Handles the ?action=marketdata request from the website.
 * Already integrated into doGet in Google_Sheets_Backend.js
 */
function handleMarketDataRequest() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(MARKET_DATA_SHEET);

  if (!sheet || sheet.getLastRow() < 2) {
    return { success: false, error: 'No market data available' };
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
  const headers = ['city', 'medianPrice', 'pricePerSqft', 'homesSold',
                    'daysOnMarket', 'inventory', 'priceChange', 'lastUpdated', 'source'];

  const results = data.map(function(row) {
    const obj = {};
    headers.forEach(function(h, i) {
      obj[h] = row[i];
    });
    // Convert YoY back to percentage for display
    if (obj.priceChange && typeof obj.priceChange === 'number') {
      obj.priceChange = Math.round(obj.priceChange * 1000) / 10;
    }
    return obj;
  });

  return {
    success: true,
    data: results,
    lastUpdated: results.length > 0 ? results[0].lastUpdated : null,
    attribution: 'Data from Zillow Home Value Index (zillow.com/research)'
  };
}

// ============================================================================
// DIAGNOSTIC FUNCTION - Run this first to debug!
// ============================================================================

/**
 * Run this function to diagnose why the Zillow fetch is failing.
 * Check the Execution Log (View > Execution log) after running.
 */
function diagnoseZillowFetch() {
  Logger.log('=== ZILLOW FETCH DIAGNOSTIC ===');
  Logger.log('Testing ' + ZILLOW_ZHVI_URLS.length + ' URLs...\n');

  for (var u = 0; u < ZILLOW_ZHVI_URLS.length; u++) {
    var url = ZILLOW_ZHVI_URLS[u];
    Logger.log('--- URL ' + (u + 1) + ' ---');
    Logger.log(url);

    try {
      var response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        followRedirects: true
      });

      var code = response.getResponseCode();
      var body = response.getContentText();
      Logger.log('Status: HTTP ' + code);
      Logger.log('Size: ' + body.length + ' bytes');
      Logger.log('Content type: ' + response.getHeaders()['Content-Type']);
      Logger.log('First 300 chars:\n' + body.substring(0, 300));

      if (code === 200 && body.length > 1000) {
        // Try to find our cities
        var lines = body.split('\n');
        Logger.log('Total rows: ' + lines.length);
        Logger.log('Header: ' + lines[0].substring(0, 200));

        var found = [];
        var targets = ['San Ramon', 'Pleasanton', 'Dublin', 'Fremont', 'Tracy'];
        for (var i = 1; i < Math.min(lines.length, 50000); i++) {
          for (var t = 0; t < targets.length; t++) {
            if (lines[i].indexOf(targets[t]) !== -1 && lines[i].indexOf(',CA,') !== -1) {
              found.push(targets[t] + ' (row ' + i + '): ' + lines[i].substring(0, 150));
            }
          }
        }

        if (found.length > 0) {
          Logger.log('\nFOUND TARGET CITIES:');
          found.forEach(function(f) { Logger.log('  ' + f); });
          Logger.log('\nThis URL WORKS. Run fetchMarketData() to populate your sheet.');
        } else {
          Logger.log('\nWARNING: CSV downloaded but no target cities found.');
          Logger.log('Checking State column format...');
          // Show a few CA rows to debug
          for (var j = 1; j < Math.min(lines.length, 100); j++) {
            if (lines[j].indexOf('CA') !== -1 || lines[j].indexOf('California') !== -1) {
              Logger.log('  Sample CA row: ' + lines[j].substring(0, 200));
              break;
            }
          }
        }
        return;
      }
    } catch (e) {
      Logger.log('ERROR: ' + e.toString());
    }
    Logger.log('');
  }

  Logger.log('\n=== ALL URLs FAILED ===');
  Logger.log('Possible causes:');
  Logger.log('1. Zillow changed their CSV download URLs');
  Logger.log('2. Google Apps Script is blocked from fetching the file');
  Logger.log('3. Network/firewall issue');
  Logger.log('\nManual fix: Go to https://www.zillow.com/research/data/');
  Logger.log('Look for ZHVI > Single Family Homes > City level > Download CSV');
  Logger.log('Copy the download URL and update ZILLOW_ZHVI_URLS in the script.');
}

// ============================================================================
// TRIGGER SETUP
// ============================================================================

/**
 * Sets up a weekly trigger to auto-fetch market data every Monday at 6 AM
 */
function setupMarketDataTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'fetchMarketData') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('fetchMarketData')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(6)
    .create();

  Logger.log('Weekly market data trigger set for Mondays at 6 AM');
}
