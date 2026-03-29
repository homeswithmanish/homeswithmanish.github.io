/*
 * DATA STALENESS MONITOR — Google Apps Script
 * ================================================================
 * Monitors your Google Sheets data for staleness and blank values.
 * Sends alert emails to you when data hasn't been refreshed in over
 * a week, or when critical data fields are blank.
 *
 * ADD TO YOUR EXISTING APPS SCRIPT PROJECT:
 * 1. Open your Google Apps Script project (the one with Google_Sheets_Backend.js)
 * 2. Click "+" next to Files → Script → Name it "Data_Staleness_Monitor"
 * 3. Paste this entire file
 * 4. Run setupStalenessMonitor() once to create the daily trigger
 *
 * This will check every day at 8 AM and alert you if:
 * - MarketData sheet hasn't been updated in >7 days
 * - MortgageRates sheet hasn't been updated in >7 days
 * - RentalData sheet hasn't been updated in >7 days
 * - Any sheet has completely blank/empty data rows
 * - Any critical columns have blank values
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Uses SHEET_ID and NOTIFICATION_EMAIL from Google_Sheets_Backend.js
// If running standalone, uncomment these:
// const SHEET_ID = '1Ee-7rplfP4rzFH28_6_0BM8s6xV2OyzVpqZSAIlY2TU';
// const NOTIFICATION_EMAIL = 'homeswithmanish@gmail.com';

// Maximum allowed age for data (in days) before triggering an alert
const STALENESS_THRESHOLD_DAYS = 7;

// Sheets to monitor and their configurations
const MONITORED_SHEETS = [
  {
    sheetName: 'MarketData',
    dateColumn: 8,            // Column H = lastUpdated (1-indexed)
    dateFormat: 'datestring',  // Dates stored as strings like "2026-03-28" or Date objects
    requiredColumns: [1, 2, 3], // City, MedianPrice, PricePerSqft must not be blank
    requiredColumnNames: ['City', 'Median Price', 'Price/SqFt'],
    description: 'Market Data (home prices, inventory, days on market)'
  },
  {
    sheetName: 'MortgageRates',
    dateColumn: 1,            // Column A = date/timestamp
    dateFormat: 'datestring',
    requiredColumns: [2, 3],  // Rate columns must not be blank
    requiredColumnNames: ['30-Year Rate', '15-Year Rate'],
    description: 'Mortgage Rates'
  },
  {
    sheetName: 'RentalData',
    dateColumn: 7,            // Column G = lastUpdated
    dateFormat: 'datestring',
    requiredColumns: [1, 2],  // City, Rent must not be blank
    requiredColumnNames: ['City', 'Rent'],
    description: 'Rental Data (rental prices by city)'
  }
];

// ============================================================================
// MAIN MONITORING FUNCTION
// ============================================================================

/**
 * Main monitoring function — runs daily via time-based trigger.
 * Checks all monitored sheets for staleness and blank data.
 * Sends a single consolidated alert email if any issues are found.
 */
function checkDataStaleness() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const now = new Date();
  const issues = [];

  MONITORED_SHEETS.forEach(function(config) {
    const sheet = ss.getSheetByName(config.sheetName);

    // Check 1: Sheet doesn't exist
    if (!sheet) {
      issues.push({
        sheet: config.sheetName,
        severity: 'critical',
        issue: 'Sheet "' + config.sheetName + '" not found in spreadsheet',
        description: config.description
      });
      return;
    }

    const lastRow = sheet.getLastRow();

    // Check 2: Sheet is empty (only headers or completely blank)
    if (lastRow < 2) {
      issues.push({
        sheet: config.sheetName,
        severity: 'critical',
        issue: 'Sheet is empty — no data rows found (only headers or completely blank)',
        description: config.description
      });
      return;
    }

    // Get all data (excluding header row)
    const dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
    const data = dataRange.getValues();

    // Check 3: All rows blank
    const allBlank = data.every(function(row) {
      return row.every(function(cell) {
        return cell === '' || cell === null || cell === undefined;
      });
    });

    if (allBlank) {
      issues.push({
        sheet: config.sheetName,
        severity: 'critical',
        issue: 'All data rows are blank — sheet appears to have been cleared',
        description: config.description
      });
      return;
    }

    // Check 4: Data staleness — check the date column
    if (config.dateColumn) {
      var mostRecentDate = null;

      data.forEach(function(row) {
        var cellValue = row[config.dateColumn - 1]; // Convert to 0-indexed
        var cellDate = parseDate(cellValue);

        if (cellDate && (!mostRecentDate || cellDate > mostRecentDate)) {
          mostRecentDate = cellDate;
        }
      });

      if (!mostRecentDate) {
        issues.push({
          sheet: config.sheetName,
          severity: 'warning',
          issue: 'No valid dates found in the date column — unable to determine data freshness',
          description: config.description
        });
      } else {
        var ageInDays = Math.floor((now - mostRecentDate) / (1000 * 60 * 60 * 24));

        if (ageInDays > STALENESS_THRESHOLD_DAYS) {
          issues.push({
            sheet: config.sheetName,
            severity: 'warning',
            issue: 'Data is ' + ageInDays + ' days old (last updated: ' + formatDate(mostRecentDate) + '). Threshold is ' + STALENESS_THRESHOLD_DAYS + ' days.',
            description: config.description
          });
        }
      }
    }

    // Check 5: Blank values in required columns
    if (config.requiredColumns && config.requiredColumns.length > 0) {
      config.requiredColumns.forEach(function(colIndex, i) {
        var blankCount = 0;
        var totalRows = data.length;

        data.forEach(function(row) {
          var cellValue = row[colIndex - 1]; // Convert to 0-indexed
          if (cellValue === '' || cellValue === null || cellValue === undefined) {
            blankCount++;
          }
        });

        if (blankCount > 0) {
          var colName = (config.requiredColumnNames && config.requiredColumnNames[i]) || ('Column ' + colIndex);
          var pct = Math.round((blankCount / totalRows) * 100);

          issues.push({
            sheet: config.sheetName,
            severity: blankCount === totalRows ? 'critical' : 'warning',
            issue: colName + ' has ' + blankCount + ' blank value' + (blankCount > 1 ? 's' : '') + ' out of ' + totalRows + ' rows (' + pct + '% missing)',
            description: config.description
          });
        }
      });
    }
  });

  // Send alert if any issues found
  if (issues.length > 0) {
    sendStalenessAlert(issues);
    Logger.log('Data staleness alert sent with ' + issues.length + ' issue(s)');
  } else {
    Logger.log('All data sheets are fresh and complete. No alert needed.');
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parses various date formats into a Date object
 *
 * @param {*} value - The value to parse (Date, string, or number)
 * @returns {Date|null} Parsed Date object or null if unparseable
 */
function parseDate(value) {
  if (!value) return null;

  // Already a Date object
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  // String date like "2026-03-28" or "March 28, 2026"
  if (typeof value === 'string') {
    var parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // Number (epoch milliseconds)
  if (typeof value === 'number') {
    var numDate = new Date(value);
    if (!isNaN(numDate.getTime())) {
      return numDate;
    }
  }

  return null;
}

/**
 * Formats a Date object as a human-readable string
 *
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

/**
 * Sends a consolidated alert email with all detected data issues
 *
 * @param {Array} issues - Array of issue objects with sheet, severity, issue, description
 */
function sendStalenessAlert(issues) {
  try {
    var criticalCount = issues.filter(function(i) { return i.severity === 'critical'; }).length;
    var warningCount = issues.filter(function(i) { return i.severity === 'warning'; }).length;

    var severityLabel = criticalCount > 0 ? 'CRITICAL' : 'WARNING';
    var subject = '[' + severityLabel + '] Data Freshness Alert — ' + issues.length + ' issue' + (issues.length > 1 ? 's' : '') + ' detected';

    // Build issue rows HTML
    var issueRows = issues.map(function(issue) {
      var color = issue.severity === 'critical' ? '#e74c3c' : '#f39c12';
      var badge = issue.severity === 'critical' ? 'CRITICAL' : 'WARNING';

      return '<tr>' +
        '<td style="padding: 12px; border-bottom: 1px solid #eee;">' +
          '<span style="display: inline-block; background: ' + color + '; color: white; font-size: 10px; padding: 2px 8px; border-radius: 3px; font-weight: 600;">' + badge + '</span>' +
        '</td>' +
        '<td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">' + escapeHtml(issue.sheet) + '</td>' +
        '<td style="padding: 12px; border-bottom: 1px solid #eee;">' + escapeHtml(issue.issue) + '</td>' +
      '</tr>';
    }).join('');

    var htmlBody = '<html>' +
      '<body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background: #f5f5f5;">' +
        '<div style="max-width: 650px; margin: 0 auto; background: #fff;">' +

          // Header
          '<div style="background: ' + (criticalCount > 0 ? '#e74c3c' : '#f39c12') + '; padding: 24px 32px; text-align: center;">' +
            '<h1 style="color: #fff; margin: 0; font-size: 20px;">Data Freshness Alert</h1>' +
            '<p style="color: rgba(255,255,255,.8); margin: 8px 0 0; font-size: 13px;">' +
              criticalCount + ' critical, ' + warningCount + ' warning' + (warningCount !== 1 ? 's' : '') +
            '</p>' +
          '</div>' +

          // Body
          '<div style="padding: 32px;">' +
            '<p style="font-size: 14px; line-height: 1.6;">Hi Manish,</p>' +
            '<p style="font-size: 14px; line-height: 1.6;">' +
              'The daily data freshness check found <strong>' + issues.length + ' issue' + (issues.length > 1 ? 's' : '') + '</strong> ' +
              'with your spreadsheet data that may need attention:' +
            '</p>' +

            // Issues table
            '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">' +
              '<thead>' +
                '<tr style="background: #f8f8f8;">' +
                  '<th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #888;">Severity</th>' +
                  '<th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #888;">Sheet</th>' +
                  '<th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #888;">Issue</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' + issueRows + '</tbody>' +
            '</table>' +

            // Action steps
            '<div style="background: #f0f7ff; padding: 16px; border-radius: 6px; border-left: 4px solid #4285F4; margin: 20px 0;">' +
              '<p style="font-size: 13px; font-weight: 600; color: #0F1B2D; margin: 0 0 8px;">What to do:</p>' +
              '<p style="font-size: 13px; color: #555; margin: 0; line-height: 1.6;">' +
                'If data fetcher scripts are set up, they should run automatically. ' +
                'If not, manually update the affected sheets in your ' +
                '<a href="https://docs.google.com/spreadsheets/d/' + SHEET_ID + '" style="color: #4285F4;">Google Sheet</a>. ' +
                'Market data can be pulled from Redfin, mortgage rates from Freddie Mac, and rental data from Zillow.' +
              '</p>' +
            '</div>' +

            '<p style="font-size: 13px; color: #888; margin-top: 24px;">' +
              'This alert runs daily at 8 AM. To adjust the threshold (' + STALENESS_THRESHOLD_DAYS + ' days) or disable it, ' +
              'edit the Data_Staleness_Monitor script in your Apps Script project.' +
            '</p>' +
          '</div>' +

          // Footer
          '<div style="background: #f5f5f5; padding: 16px 32px; text-align: center;">' +
            '<p style="font-size: 11px; color: #999; margin: 0;">Homes With Manish — Automated Data Monitor</p>' +
          '</div>' +

        '</div>' +
      '</body>' +
    '</html>';

    GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, 'Data freshness issues detected. Please check your spreadsheet.', { htmlBody: htmlBody });

  } catch (error) {
    Logger.log('Error sending staleness alert: ' + error.toString());
  }
}

// ============================================================================
// SETUP — Run once to create the daily trigger
// ============================================================================

/**
 * Sets up a daily time-based trigger for the staleness monitor.
 * Run this function ONCE from the Apps Script editor.
 *
 * Creates a trigger that runs checkDataStaleness() every day at 8 AM.
 */
function setupStalenessMonitor() {
  // Remove any existing staleness triggers to prevent duplicates
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'checkDataStaleness') {
      ScriptApp.deleteTrigger(trigger);
      Logger.log('Removed existing staleness trigger');
    }
  });

  // Create new daily trigger at 8 AM
  ScriptApp.newTrigger('checkDataStaleness')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  Logger.log('========================================');
  Logger.log('STALENESS MONITOR SETUP COMPLETE');
  Logger.log('========================================');
  Logger.log('The monitor will run daily at ~8 AM');
  Logger.log('It checks: MarketData, MortgageRates, RentalData');
  Logger.log('Alert threshold: ' + STALENESS_THRESHOLD_DAYS + ' days');
  Logger.log('Alerts sent to: ' + NOTIFICATION_EMAIL);
  Logger.log('========================================');

  // Run an immediate check
  Logger.log('Running initial check now...');
  checkDataStaleness();
}

/**
 * Manually trigger a staleness check (useful for testing)
 */
function manualStalenessCheck() {
  Logger.log('Running manual staleness check...');
  checkDataStaleness();
}
