/*
 * REAL ESTATE LEAD CAPTURE SYSTEM - Google Apps Script Backend
 * ================================================================
 *
 * This Google Apps Script serves as the backend for a real estate website's
 * lead capture system. It handles lead submissions, stores them in Google Sheets,
 * sends notifications, and provides an admin API for lead management.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Create a new Google Sheet and note its ID
 * 2. Create a new Google Apps Script bound to that sheet
 * 3. Replace SHEET_ID_PLACEHOLDER below with your actual Sheet ID
 * 4. Copy this entire script into the Apps Script editor
 * 5. Run the setup functions:
 *    - First, run: setAdminKey() [this generates and stores your API key]
 *    - Then, run: createInitialSheet() [this creates the Leads sheet with headers]
 * 6. Deploy as a web app:
 *    - Click "Deploy" -> "New deployment"
 *    - Type: "Web app"
 *    - Execute as: [Your email]
 *    - Who has access: "Anyone" (or specific domain)
 * 7. Copy the deployment URL - this is your endpoint for lead submissions
 * 8. The admin API key will be logged to console when setAdminKey() runs
 *
 * ENDPOINTS:
 * - POST to deployment URL: Submit a new lead
 * - GET from deployment URL?key=YOUR_API_KEY&action=list: Get all leads
 * - GET from deployment URL?key=YOUR_API_KEY&action=update: Update a lead
 * - GET from deployment URL?key=YOUR_API_KEY&action=stats: Get statistics
 */

// ============================================================================
// CONFIGURATION SECTION
// ============================================================================

// Google Sheet ID - REQUIRED: Replace with your actual Sheet ID
const SHEET_ID = '1Ee-7rplfP4rzFH28_6_0BM8s6xV2OyzVpqZSAIlY2TU';

// Name of the sheet tab where leads will be stored
const SHEET_NAME = 'Leads';

// Email address where notifications will be sent
const NOTIFICATION_EMAIL = 'homeswithmanish@gmail.com';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 86400; // 24 hours in seconds
const RATE_LIMIT_MAX_SUBMISSIONS = 5; // Maximum submissions per email in 24 hours

// Cache key prefix for rate limiting
const CACHE_PREFIX = 'lead_submission_';

// ============================================================================
// MAIN REQUEST HANDLERS
// ============================================================================

/**
 * Handles POST requests for new lead submissions from the website
 *
 * Expected JSON body:
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "phone": "555-123-4567",
 *   "city": "Austin",
 *   "interest": "3BR Home",
 *   "source": "hero" or "contact",
 *   "message": "I'm interested in this property" (optional)
 * }
 *
 * @param {Object} e - The event object containing POST data
 * @returns {Object} JSON response with success status and message
 */
function doPost(e) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Content-Type': 'application/json'
    };

    // Parse the JSON body
    let requestData = {};
    try {
      requestData = JSON.parse(e.postData.contents);
    } catch (error) {
      return HtmlService.createHtmlOutput(JSON.stringify({
        success: false,
        message: 'Invalid JSON format'
      })).setHeader('Content-Type', 'application/json').setHeaders(headers);
    }

    // Sanitize inputs
    const firstName = sanitizeInput(requestData.firstName);
    const lastName = sanitizeInput(requestData.lastName);
    const email = sanitizeInput(requestData.email);
    const phone = sanitizeInput(requestData.phone);
    const city = sanitizeInput(requestData.city);
    const interest = sanitizeInput(requestData.interest);
    const source = sanitizeInput(requestData.source);
    const message = sanitizeInput(requestData.message);

    // Validate required fields
    if (!firstName || !email) {
      return HtmlService.createHtmlOutput(JSON.stringify({
        success: false,
        message: 'First name and email are required'
      })).setHeader('Content-Type', 'application/json').setHeaders(headers);
    }

    // Validate email format
    if (!validateEmail(email)) {
      return HtmlService.createHtmlOutput(JSON.stringify({
        success: false,
        message: 'Invalid email format'
      })).setHeader('Content-Type', 'application/json').setHeaders(headers);
    }

    // Check rate limit
    const rateLimitStatus = rateLimitCheck(email);
    if (rateLimitStatus.limited) {
      return HtmlService.createHtmlOutput(JSON.stringify({
        success: false,
        message: 'Too many submissions from this email. Please try again later.'
      })).setHeader('Content-Type', 'application/json').setHeaders(headers);
    }

    // Add lead to Google Sheet
    const timestamp = new Date().toISOString();
    const leadData = [
      timestamp,
      firstName,
      lastName,
      email,
      phone,
      city,
      interest,
      source,
      message,
      'New', // Status
      ''     // Notes
    ];

    appendLeadToSheet(leadData);

    // Send notification email to admin
    sendNotificationEmail(firstName, lastName, email, phone, city, interest, message);

    // Return success response
    return HtmlService.createHtmlOutput(JSON.stringify({
      success: true,
      message: 'Thank you! Your information has been received. We will contact you shortly.'
    })).setHeader('Content-Type', 'application/json').setHeaders(headers);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return HtmlService.createHtmlOutput(JSON.stringify({
      success: false,
      message: 'An error occurred processing your request'
    })).setHeader('Content-Type', 'application/json');
  }
}

/**
 * Handles GET requests for admin dashboard and API operations
 * Requires valid API key as query parameter
 *
 * Supported actions:
 * - list: Returns all leads as JSON array
 * - update: Updates a lead's status or notes
 * - stats: Returns summary statistics
 *
 * @param {Object} e - The event object containing query parameters
 * @returns {Object} JSON response with requested data
 */
function doGet(e) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Content-Type': 'application/json'
    };

    const action = e.parameter.action || 'list';

    // Public endpoints (no API key required)
    if (action === 'marketdata') {
      const marketResponse = handleMarketDataRequest();
      return ContentService.createTextOutput(JSON.stringify(marketResponse))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'mortgagerates') {
      const ratesResponse = handleMortgageRatesRequest();
      return ContentService.createTextOutput(JSON.stringify(ratesResponse))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'rentaldata') {
      const rentalResponse = handleRentalDataRequest();
      return ContentService.createTextOutput(JSON.stringify(rentalResponse))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // All other actions require API key
    const apiKey = e.parameter.key;

    if (!isValidApiKey(apiKey)) {
      return HtmlService.createHtmlOutput(JSON.stringify({
        success: false,
        message: 'Unauthorized: Invalid API key',
        status: 401
      })).setHeader('Content-Type', 'application/json').setHeaders(headers);
    }

    let responseData;

    switch (action) {
      case 'list':
        responseData = handleListAction();
        break;
      case 'update':
        responseData = handleUpdateAction(e.parameter);
        break;
      case 'stats':
        responseData = handleStatsAction();
        break;
      default:
        responseData = {
          success: false,
          message: 'Unknown action: ' + action
        };
    }

    return HtmlService.createHtmlOutput(JSON.stringify(responseData))
      .setHeader('Content-Type', 'application/json')
      .setHeaders(headers);

  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return HtmlService.createHtmlOutput(JSON.stringify({
      success: false,
      message: 'An error occurred processing your request'
    })).setHeader('Content-Type', 'application/json');
  }
}

// ============================================================================
// MARKET DATA HANDLER (PUBLIC - NO AUTH REQUIRED)
// ============================================================================

/**
 * Returns market data from the MarketData sheet as JSON.
 * Called by the website to populate the market data table dynamically.
 */
function handleMarketDataRequest() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('MarketData');

  if (!sheet || sheet.getLastRow() < 2) {
    return { success: false, error: 'No market data available' };
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
  const headers = ['city', 'medianPrice', 'pricePerSqft', 'homesSold',
                    'daysOnMarket', 'inventory', 'priceChange', 'lastUpdated', 'source'];

  const results = data.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  return {
    success: true,
    data: results,
    lastUpdated: results.length > 0 ? results[0].lastUpdated : null,
    attribution: 'Data sourced from Redfin (www.redfin.com)'
  };
}

// ============================================================================
// ADMIN API ACTION HANDLERS
// ============================================================================

/**
 * Handles the 'list' action - returns all leads as JSON array
 * @returns {Object} Response with leads array or error
 */
function handleListAction() {
  try {
    const leads = getLeadsData();
    return {
      success: true,
      count: leads.length,
      leads: leads
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error retrieving leads: ' + error.toString()
    };
  }
}

/**
 * Handles the 'update' action - updates a lead's status or notes
 * Query parameters: row (required), status (optional), notes (optional)
 *
 * @param {Object} params - Query parameters
 * @returns {Object} Response with success status
 */
function handleUpdateAction(params) {
  try {
    const rowNumber = parseInt(params.row);
    const newStatus = params.status;
    const newNotes = params.notes;

    if (!rowNumber || rowNumber < 2) { // Row 1 is headers
      return {
        success: false,
        message: 'Invalid row number'
      };
    }

    const sheet = getSheet();
    const lastRow = sheet.getLastRow();

    if (rowNumber > lastRow) {
      return {
        success: false,
        message: 'Row number out of range'
      };
    }

    // Update status if provided (column 10)
    if (newStatus) {
      sheet.getRange(rowNumber, 10).setValue(newStatus);
    }

    // Update notes if provided (column 11)
    if (newNotes) {
      sheet.getRange(rowNumber, 11).setValue(newNotes);
    }

    return {
      success: true,
      message: 'Lead updated successfully',
      row: rowNumber
    };

  } catch (error) {
    return {
      success: false,
      message: 'Error updating lead: ' + error.toString()
    };
  }
}

/**
 * Handles the 'stats' action - returns summary statistics
 * @returns {Object} Response with statistics
 */
function handleStatsAction() {
  try {
    const leads = getLeadsData();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    let stats = {
      success: true,
      total: leads.length,
      newThisWeek: 0,
      byStatus: {},
      byCity: {},
      bySource: {}
    };

    // Process each lead
    leads.forEach(lead => {
      // Count new leads this week
      const leadDate = new Date(lead.timestamp);
      if (leadDate >= sevenDaysAgo) {
        stats.newThisWeek++;
      }

      // Count by status
      const status = lead.status || 'Unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Count by city
      const city = lead.city || 'Not specified';
      stats.byCity[city] = (stats.byCity[city] || 0) + 1;

      // Count by source
      const source = lead.source || 'Unknown';
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    });

    return stats;

  } catch (error) {
    return {
      success: false,
      message: 'Error generating statistics: ' + error.toString()
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS - INPUT VALIDATION & SANITIZATION
// ============================================================================

/**
 * Sanitizes input by removing HTML tags and trimming whitespace
 * Protects against XSS attacks and malformed data
 *
 * @param {*} input - The input to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (!input) return '';

  // Convert to string
  let str = String(input);

  // Remove HTML tags
  str = str.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  // Trim whitespace
  str = str.trim();

  // Limit length to prevent abuse
  if (str.length > 1000) {
    str = str.substring(0, 1000);
  }

  return str;
}

/**
 * Validates email format using regex pattern
 *
 * @param {string} email - The email to validate
 * @returns {boolean} True if email format is valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// HELPER FUNCTIONS - RATE LIMITING
// ============================================================================

/**
 * Checks if an email has exceeded the rate limit for lead submissions
 * Uses Google Apps Script CacheService to track submissions
 *
 * @param {string} email - The email to check
 * @returns {Object} Object with limited (boolean) and count (number) properties
 */
function rateLimitCheck(email) {
  const cache = CacheService.getScriptCache();
  const cacheKey = CACHE_PREFIX + email;

  // Get current submission count
  let count = cache.get(cacheKey);
  count = count ? parseInt(count) + 1 : 1;

  // Check if limit exceeded
  const limited = count > RATE_LIMIT_MAX_SUBMISSIONS;

  // Update cache with new count (expires after 24 hours)
  cache.put(cacheKey, String(count), RATE_LIMIT_WINDOW);

  return {
    limited: limited,
    count: count,
    remaining: Math.max(0, RATE_LIMIT_MAX_SUBMISSIONS - count + 1)
  };
}

// ============================================================================
// HELPER FUNCTIONS - SHEET OPERATIONS
// ============================================================================

/**
 * Gets the Leads sheet, creating it if necessary
 *
 * @returns {Sheet} The Leads sheet object
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    createSheetHeaders(sheet);
  }

  return sheet;
}

/**
 * Creates headers for the Leads sheet
 *
 * @param {Sheet} sheet - The sheet to add headers to
 */
function createSheetHeaders(sheet) {
  const headers = [
    'Timestamp',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'City',
    'Interest',
    'Source',
    'Message',
    'Status',
    'Notes'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285F4');
  headerRange.setFontColor('#FFFFFF');

  // Set column widths
  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(2, 120); // First Name
  sheet.setColumnWidth(3, 120); // Last Name
  sheet.setColumnWidth(4, 200); // Email
  sheet.setColumnWidth(5, 130); // Phone
  sheet.setColumnWidth(6, 120); // City
  sheet.setColumnWidth(7, 150); // Interest
  sheet.setColumnWidth(8, 100); // Source
  sheet.setColumnWidth(9, 250); // Message
  sheet.setColumnWidth(10, 100); // Status
  sheet.setColumnWidth(11, 200); // Notes

  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Appends a new lead to the sheet
 *
 * @param {Array} leadData - Array of lead data matching column order
 */
function appendLeadToSheet(leadData) {
  const sheet = getSheet();
  sheet.appendRow(leadData);
}

/**
 * Retrieves all leads from the sheet as an array of objects
 *
 * @returns {Array} Array of lead objects with properties from headers
 */
function getLeadsData() {
  const sheet = getSheet();
  const range = sheet.getDataRange();
  const values = range.getValues();

  if (values.length < 2) {
    return []; // Only headers, no data
  }

  const headers = values[0];
  const leads = [];

  // Convert each row to an object
  for (let i = 1; i < values.length; i++) {
    const lead = {};
    for (let j = 0; j < headers.length; j++) {
      lead[headers[j].toLowerCase().replace(/\s+/g, '')] = values[i][j];
    }
    leads.push(lead);
  }

  return leads;
}

/**
 * Updates a specific row in the sheet
 * Wrapper function for updating individual lead records
 *
 * @param {number} rowNumber - The row number to update (1-based)
 * @param {number} columnNumber - The column number to update (1-based)
 * @param {*} value - The new value
 */
function updateLeadRow(rowNumber, columnNumber, value) {
  const sheet = getSheet();
  sheet.getRange(rowNumber, columnNumber).setValue(value);
}

// ============================================================================
// HELPER FUNCTIONS - EMAIL NOTIFICATIONS
// ============================================================================

/**
 * Sends a formatted notification email to the admin when a new lead is submitted
 *
 * @param {string} firstName - Lead's first name
 * @param {string} lastName - Lead's last name
 * @param {string} email - Lead's email
 * @param {string} phone - Lead's phone number
 * @param {string} city - Lead's city
 * @param {string} interest - Lead's area of interest
 * @param {string} message - Lead's optional message
 */
function sendNotificationEmail(firstName, lastName, email, phone, city, interest, message) {
  try {
    const subject = 'New Lead Submission: ' + firstName + ' ' + lastName;

    const htmlBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #4285F4; border-bottom: 2px solid #4285F4; padding-bottom: 10px;">
              New Lead Submission
            </h2>

            <div style="margin: 20px 0;">
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>City:</strong> ${city || 'Not provided'}</p>
              <p><strong>Interest:</strong> ${interest || 'Not specified'}</p>
            </div>

            ${message ? `
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 3px; margin: 20px 0;">
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message)}</p>
              </div>
            ` : ''}

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="color: #999; font-size: 12px;">
                This is an automated message from your lead capture system.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, '', { htmlBody: htmlBody });
    Logger.log('Notification email sent to ' + NOTIFICATION_EMAIL);

  } catch (error) {
    Logger.log('Error sending notification email: ' + error.toString());
  }
}

/**
 * Escapes HTML special characters for safe display in emails
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// HELPER FUNCTIONS - SECURITY & AUTHENTICATION
// ============================================================================

/**
 * Validates the provided API key against the stored admin key
 *
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} True if the key is valid
 */
function isValidApiKey(apiKey) {
  if (!apiKey) return false;

  const scriptProperties = PropertiesService.getScriptProperties();
  const storedKey = scriptProperties.getProperty('ADMIN_API_KEY');

  return apiKey === storedKey;
}

// ============================================================================
// SETUP FUNCTIONS - Run these once during initial setup
// ============================================================================

/**
 * Creates the initial Leads sheet with proper headers and formatting
 *
 * RUN THIS FUNCTION ONCE during setup:
 * 1. Open the Apps Script editor
 * 2. Select this function from the dropdown at the top
 * 3. Click the "Run" button
 * 4. Authorize the script when prompted
 */
function createInitialSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      Logger.log('Created new sheet: ' + SHEET_NAME);
    } else {
      Logger.log('Sheet already exists: ' + SHEET_NAME);
      return;
    }

    createSheetHeaders(sheet);
    Logger.log('Headers created successfully');

  } catch (error) {
    Logger.log('Error creating sheet: ' + error.toString());
  }
}

/**
 * Generates and stores a random admin API key in Script Properties
 *
 * RUN THIS FUNCTION ONCE during setup:
 * 1. Open the Apps Script editor
 * 2. Select this function from the dropdown at the top
 * 3. Click the "Run" button
 * 4. Check the "Execution log" at the bottom to see your generated API key
 * 5. Copy this key and save it in a safe location
 * 6. Use this key when making API requests to the doGet handler
 *
 * NOTE: The API key is also logged to the console for easy access
 */
function setAdminKey() {
  try {
    // Generate a random 32-character API key
    const apiKey = generateRandomKey(32);

    // Store it in Script Properties
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('ADMIN_API_KEY', apiKey);

    Logger.log('========================================');
    Logger.log('ADMIN API KEY GENERATED AND STORED');
    Logger.log('========================================');
    Logger.log('Your API Key: ' + apiKey);
    Logger.log('========================================');
    Logger.log('IMPORTANT: Save this key in a secure location!');
    Logger.log('Use this key in all admin API requests: ?key=' + apiKey);
    Logger.log('========================================');

  } catch (error) {
    Logger.log('Error setting admin key: ' + error.toString());
  }
}

/**
 * Generates a random alphanumeric string of specified length
 * Used for creating secure API keys
 *
 * @param {number} length - Length of the key to generate
 * @returns {string} Random alphanumeric string
 */
function generateRandomKey(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

/**
 * Helper function to manually reset the admin API key
 * Useful if you need to regenerate the key for security reasons
 *
 * Run this function the same way as setAdminKey()
 */
function resetAdminKey() {
  Logger.log('Resetting admin API key...');
  setAdminKey();
}
