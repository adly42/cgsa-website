// ============================================================
// CGSA Newsletters (fallback)
// ============================================================
// The live list comes from the "Newsletter" tab of the Google
// Sheet (see data/config.js). Headers there are:
//
//   Date | Title | PDF
//
//   Date:  "YYYY-MM-DD" (publication date, used for ordering;
//          format the column as Plain text in Sheets)
//   Title: edition name, e.g. "Fall 2026 Edition"
//   PDF:   a LINK to the PDF pasted as text (a Google Drive
//          share link works if the file is shared "Anyone with
//          the link")
//
// The newest edition is featured with a read button; the rest
// are listed underneath. The whole section stays hidden until
// at least one row exists.
//
// This file is only used if the sheet can't be reached. Same
// fields, lowercase:
//
//   { date: "2026-09-01", title: "Fall 2026 Edition", pdf: "https://..." }
// ============================================================

const NEWSLETTERS = [];
