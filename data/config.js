// ============================================================
// CGSA Site Config
// ============================================================
// OPTIONAL: load the exec team and events from a Google Sheet
// instead of the files in this folder, so nobody has to touch
// code to update the site.
//
// One-time setup (5 minutes, see README for details):
//   1. Create a Google Sheet with two tabs named exactly
//      "Exec" and "Events".
//      - Exec headers (row 1):   Name | Role | Email | Photo
//      - Events headers (row 1): Date | Title | Time | Location | Blurb
//        (Date must be typed as YYYY-MM-DD, e.g. 2026-09-10.
//        Format the Date column as Plain text in Sheets.)
//   2. Share → "Anyone with the link" → Viewer.
//   3. Copy the long ID from the sheet URL
//      (docs.google.com/spreadsheets/d/THIS-PART/edit)
//      and paste it between the quotes below.
//
// Leave sheetId empty ("") to use data/exec-team.js and
// data/events.js instead. If the sheet ever fails to load, the
// site falls back to those files automatically, so keep them
// roughly up to date as a backup.
// ============================================================

const SITE_CONFIG = {
  sheetId: ""
};
