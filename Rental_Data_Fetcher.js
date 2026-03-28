/*
 * RENTAL DATA FETCHER - Google Apps Script
 * ================================================================
 *
 * Fetches rental data from Zillow's Observed Rent Index (ZORI)
 * for East Bay cities and stores it in a "RentalData" sheet.
 *
 * DATA SOURCE: Zillow ZORI - Single Family & Condo/Co-op
 * https://www.zillow.com/research/data/
 *
 * SETUP:
 * 1. Add this code to your Apps Script project
 * 2. Run setupRentalDataSheet() once
 * 3. Run fetchRentalData() to test
 * 4. Run setupRentalDataTrigger() for weekly auto-updates
 * 5. Add the rentaldata endpoint to doGet
 * 6. Re-deploy the web app as a new version
 */

// Zillow ZORI CSV URLs (try multiple since Zillow changes paths)
const ZILLOW_ZORI_URLS = [
  'https://files.zillowstatic.com/research/public_v2/zori/City_zori_uc_sfrcondomfr_sm_month.csv',
  'https://files.zillowstatic.com/research/public_csvs/zori/City_zori_uc_sfrcondomfr_sm_month.csv',
  'https://files.zillowstatic.com/research/public_v2/zori/City_zori_sm_month.csv',
  'https://files.zillowstatic.com/research/public_csvs/zori/City_zori_sm_month.csv'
];

const RENTAL_DATA_SHEET = 'RentalData';

// Same 7 cities as market data
const RENTAL_TARGET_CITIES = [
  { city: 'San Ramon', state: 'CA' },
  { city: 'Pleasanton', state: 'CA' },
  { city: 'Danville', state: 'CA' },
  { city: 'Dublin', state: 'CA' },
  { city: 'Livermore', state: 'CA' },
  { city: 'Fremont', state: 'CA' },
  { city: 'Tracy', state: 'CA' }
];

// Fallback rent estimates (used if Zillow ZORI doesn't cover a city)
const RENT_ESTIMATES = {
  'San Ramon': 3800,
  'Pleasanton': 3900,
  'Danville': 4200,
  'Dublin': 3500,
  'Livermore': 3200,
  'Fremont': 3600,
  'Tracy': 2400
};

// ============================================================================
// FETCH FUNCTION
// ============================================================================

function fetchRentalData() {
  Logger.log('Fetching rental data from Zillow ZORI...');

  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(RENTAL_DATA_SHEET);

  if (!sheet) {
    setupRentalDataSheet();
    sheet = ss.getSheetByName(RENTAL_DATA_SHEET);
  }

  // Also read home values from MarketData sheet for yield calculation
  var marketSheet = ss.getSheetByName('MarketData');
  var homeValues = {};
  if (marketSheet && marketSheet.getLastRow() > 1) {
    var marketData = marketSheet.getRange(2, 1, marketSheet.getLastRow() - 1, 2).getValues();
    marketData.forEach(function(row) {
      homeValues[row[0]] = row[1];
    });
  }

  try {
    var csvText = null;

    for (var u = 0; u < ZILLOW_ZORI_URLS.length; u++) {
      var url = ZILLOW_ZORI_URLS[u];
      Logger.log('Trying ZORI URL ' + (u + 1) + '/' + ZILLOW_ZORI_URLS.length + ': ' + url);

      try {
        var response = UrlFetchApp.fetch(url, {
          muteHttpExceptions: true,
          followRedirects: true
        });

        var code = response.getResponseCode();
        Logger.log('HTTP ' + code);

        if (code === 200) {
          csvText = response.getContentText();
          Logger.log('ZORI CSV downloaded. Size: ' + csvText.length + ' bytes');
          Logger.log('First 200 chars: ' + csvText.substring(0, 200));
          break;
        }
      } catch (e) {
        Logger.log('Error: ' + e.toString());
      }
    }

    var results = [];

    if (csvText) {
      results = parseZORIData(csvText, homeValues);
    }

    // Fill in any missing cities with estimates
    var foundCities = {};
    results.forEach(function(r) { foundCities[r.city] = true; });

    RENTAL_TARGET_CITIES.forEach(function(t) {
      if (!foundCities[t.city]) {
        Logger.log(t.city + ' not found in ZORI data, using estimate');
        var rent = RENT_ESTIMATES[t.city] || 3000;
        var homeValue = homeValues[t.city] || 0;
        results.push({
          city: t.city,
          monthlyRent: rent,
          medianPrice: homeValue,
          grossYield: homeValue > 0 ? Math.round((rent * 12) / homeValue * 10000) / 100 : null,
          priceToRent: homeValue > 0 ? Math.round(homeValue / (rent * 12)) : null,
          lastUpdated: new Date().toISOString().split('T')[0],
          source: 'Estimate'
        });
      }
    });

    // Sort by preferred order
    var order = RENTAL_TARGET_CITIES.map(function(t) { return t.city; });
    results.sort(function(a, b) {
      return order.indexOf(a.city) - order.indexOf(b.city);
    });

    writeRentalDataToSheet(sheet, results);
    Logger.log('Rental data updated for ' + results.length + ' cities');

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    writeRentalFallbackData(sheet, homeValues);
  }
}

// ============================================================================
// CSV PARSING
// ============================================================================

function parseZORIData(csvText, homeValues) {
  var lines = csvText.split('\n');
  if (lines.length < 2) return [];

  var headers = parseCSVLine(lines[0]);
  var cityCol = headers.indexOf('RegionName');
  var stateCol = headers.indexOf('State');

  if (cityCol === -1 || stateCol === -1) {
    Logger.log('Could not find required columns. Headers: ' + headers.slice(0, 10).join(', '));
    return [];
  }

  // Find the latest date column
  var latestCol = -1;
  for (var i = headers.length - 1; i >= 0; i--) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(headers[i])) {
      latestCol = i;
      break;
    }
  }

  if (latestCol === -1) {
    Logger.log('No date columns found');
    return [];
  }

  var latestDate = headers[latestCol];
  Logger.log('Latest ZORI date column: ' + latestDate);

  var targetSet = {};
  RENTAL_TARGET_CITIES.forEach(function(t) {
    targetSet[t.city.toLowerCase() + '|' + t.state.toLowerCase()] = t;
  });

  var results = [];

  for (var j = 1; j < lines.length; j++) {
    if (!lines[j].trim()) continue;
    var row = parseCSVLine(lines[j]);
    if (row.length <= latestCol) continue;

    var cityName = (row[cityCol] || '').trim();
    var state = (row[stateCol] || '').trim();
    var key = cityName.toLowerCase() + '|' + state.toLowerCase();

    if (targetSet[key]) {
      var rent = parseFloat(row[latestCol]);
      if (!rent || rent <= 0) continue;

      var homeValue = homeValues[cityName] || 0;
      var monthlyRent = Math.round(rent);

      results.push({
        city: cityName,
        monthlyRent: monthlyRent,
        medianPrice: homeValue,
        grossYield: homeValue > 0 ? Math.round((monthlyRent * 12) / homeValue * 10000) / 100 : null,
        priceToRent: homeValue > 0 ? Math.round(homeValue / (monthlyRent * 12)) : null,
        lastUpdated: latestDate,
        source: 'Zillow ZORI'
      });

      Logger.log(cityName + ': $' + monthlyRent + '/mo rent, Yield: ' + (homeValue > 0 ? ((monthlyRent * 12) / homeValue * 100).toFixed(2) + '%' : 'N/A'));
      delete targetSet[key];
    }
  }

  return results;
}

// ============================================================================
// SHEET OPERATIONS
// ============================================================================

function setupRentalDataSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(RENTAL_DATA_SHEET);

  if (sheet) {
    Logger.log('RentalData sheet already exists');
    return;
  }

  sheet = ss.insertSheet(RENTAL_DATA_SHEET);
  var headers = ['City', 'Monthly Rent', 'Median Home Value', 'Gross Yield %', 'Price-to-Rent Ratio', 'Last Updated', 'Data Source'];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0F1B2D')
    .setFontColor('#C9A96E');

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 150);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 150);
  sheet.setFrozenRows(1);

  Logger.log('RentalData sheet created');
}

function writeRentalDataToSheet(sheet, data) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 7).clear();
  }

  var rows = data.map(function(d) {
    return [
      d.city,
      d.monthlyRent,
      d.medianPrice || '',
      d.grossYield !== null ? d.grossYield / 100 : '',
      d.priceToRent || '',
      d.lastUpdated,
      d.source
    ];
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 7).setValues(rows);
    sheet.getRange(2, 2, rows.length, 1).setNumberFormat('$#,##0');
    sheet.getRange(2, 3, rows.length, 1).setNumberFormat('$#,##0');
    sheet.getRange(2, 4, rows.length, 1).setNumberFormat('0.00%');
  }

  Logger.log('Wrote ' + rows.length + ' rental data rows');
}

function writeRentalFallbackData(sheet, homeValues) {
  var results = RENTAL_TARGET_CITIES.map(function(t) {
    var rent = RENT_ESTIMATES[t.city] || 3000;
    var homeValue = homeValues[t.city] || 0;
    return {
      city: t.city,
      monthlyRent: rent,
      medianPrice: homeValue,
      grossYield: homeValue > 0 ? Math.round((rent * 12) / homeValue * 10000) / 100 : null,
      priceToRent: homeValue > 0 ? Math.round(homeValue / (rent * 12)) : null,
      lastUpdated: new Date().toISOString().split('T')[0],
      source: 'Estimate'
    };
  });
  writeRentalDataToSheet(sheet, results);
}

// ============================================================================
// API ENDPOINT
// ============================================================================

/**
 * Returns rental data for the website.
 * Add to doGet: if (action === 'rentaldata') { ... }
 */
function handleRentalDataRequest() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(RENTAL_DATA_SHEET);

  if (!sheet || sheet.getLastRow() < 2) {
    return { success: false, error: 'No rental data available' };
  }

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
  var results = data.map(function(row) {
    var grossYield = row[3];
    if (grossYield && typeof grossYield === 'number' && grossYield < 1) {
      grossYield = grossYield * 100;
    }
    return {
      city: row[0],
      monthlyRent: row[1],
      medianPrice: row[2],
      grossYield: grossYield ? Math.round(grossYield * 100) / 100 : null,
      priceToRent: row[4],
      lastUpdated: row[5],
      source: row[6]
    };
  });

  return {
    success: true,
    data: results,
    lastUpdated: results.length > 0 ? results[0].lastUpdated : null,
    attribution: 'Rent data from Zillow ZORI, home values from Zillow ZHVI'
  };
}

// ============================================================================
// TRIGGER
// ============================================================================

function setupRentalDataTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'fetchRentalData') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('fetchRentalData')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7)
    .create();

  Logger.log('Weekly rental data trigger set for Mondays at 7 AM');
}
