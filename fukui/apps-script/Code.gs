/**
 * Fukui's Seafood Heritage — interview interest relay.
 *
 * Deployed as a web app (Execute as: Me, Who has access: Anyone). Only the
 * Cloudflare Worker knows its URL and RELAY_SECRET; requests without the secret
 * are rejected. It appends one row per registration to the private tracker and
 * never returns sheet data.
 */

var SHEET_ID = '1B_y3CCUqRJ8uhdNjvCyLm1wqfFmYmgTvc0EWLUngWeY';
var RELAY_SECRET = 'REPLACE_WITH_RELAY_SECRET'; // same value as the Worker secret

var HEADERS = [
  'Submitted at (UTC)', 'Name', 'Email', 'Organization / role',
  'Preferred interview language', 'Availability', 'Time zone', 'Comments',
  'Agreed to be contacted', 'Form language', 'Submission ID',
  'Follow-up status', 'Internal notes'
];
var STATUS_COL = 12; // L
var ID_COL = 11;     // K
var STATUSES = ['New', 'Contacted', 'Scheduled', 'Interviewed', 'Declined', 'No response'];

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'bad_request' });
  }
  if (!body || body.secret !== RELAY_SECRET || RELAY_SECRET.indexOf('REPLACE_') === 0) {
    return reply_({ ok: false, error: 'unauthorized' });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    setUp_(sheet);

    // A retried submission (same ID) must not create a second row.
    var id = String(body.id || '');
    if (id && sheet.getLastRow() > 1) {
      var hit = sheet.getRange(2, ID_COL, sheet.getLastRow() - 1, 1)
        .createTextFinder(id).matchEntireCell(true).findNext();
      if (hit) return reply_({ ok: true, duplicate: true });
    }

    var ts = Utilities.formatDate(new Date(body.submittedAt || Date.now()), 'Etc/UTC', 'yyyy-MM-dd HH:mm:ss');
    var submitted = [
      body.name, body.email, body.organization, body.language,
      body.availability, body.timezone, body.comments, body.consent,
      body.formLanguage, id
    ].map(clean_);
    var row = [ts].concat(submitted, ['New', '']);

    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
    return reply_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return reply_({ ok: true });
}

// Submitted values are stored as literal text: control characters are
// stripped, and the leading apostrophe (hidden by Sheets) stops a value from
// being read as a formula, number or date.
function clean_(v) {
  var s = v === undefined || v === null ? '' : String(v);
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, 2000);
  return s ? "'" + s : '';
}

// One-time formatting: header, frozen row, status dropdown, wrapped text.
function setUp_(sheet) {
  if (sheet.getFrozenRows() === 1) return;
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.setName('Responses');
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build();
  sheet.getRange(2, STATUS_COL, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, HEADERS.length).setWrap(true).setVerticalAlignment('top');
  sheet.setColumnWidths(1, HEADERS.length, 160);
  sheet.setColumnWidth(6, 260);
  sheet.setColumnWidth(8, 260);
  sheet.setColumnWidth(13, 260);
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to authorise and apply formatting. */
function setup() {
  setUp_(SpreadsheetApp.openById(SHEET_ID).getSheets()[0]);
}
