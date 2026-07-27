# CGSA Website

Website for the **Chemistry Graduate Students' Association** (CGSA),
Department of Chemistry, University of Calgary.

A plain static site — no build step, no framework, no backend — so it stays
easy for student volunteers to maintain year over year.

## Run it locally

Option 1: just open `index.html` in a browser (double-click it). Everything
works from disk.

Option 2: run a tiny local server (nicer URLs, closer to production):

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## How to update the site (no coding needed)

### Option A: Google Sheet (recommended)

Once set up, anyone with edit access to the sheet can update the exec team
and events. No code, no git, changes show up on the next page load.

One-time setup:

1. Create a Google Sheet (a shared CGSA account is best, so it survives
   handoffs). Add two tabs named exactly **Exec** and **Events**.
2. Put these headers in row 1 of each tab:
   - **Exec**: `Name | Role | Email | Photo`
   - **Events**: `Date | Title | Time | Location | Blurb | Photo`
   - **Newsletter**: `Date | Title | PDF`
     (Dates must be typed as `YYYY-MM-DD`, e.g. `2026-09-10` — format Date
     columns as **Plain text** so Sheets doesn't reformat them)

   **Photo columns take a link, not an embedded image.** Paste an image URL
   into the cell as text. Do NOT use Insert → Image — images placed inside
   cells never reach the site. The easiest workflow: upload the photo to
   Google Drive, set its sharing to "Anyone with the link", right-click →
   Copy link, and paste that into the cell — the site converts Drive share
   links to displayable images automatically. Leave the cell blank for no
   photo (exec cards show a flask icon instead).
3. Share → "Anyone with the link" → **Viewer**.
4. Copy the sheet ID from its URL
   (`docs.google.com/spreadsheets/d/`**`THIS-LONG-ID`**`/edit`) and paste it
   into `data/config.js` between the quotes: `sheetId: "THIS-LONG-ID"`.
   This is the only code-adjacent step and happens once.

From then on: edit the sheet, done. The site shows the next 10 upcoming
events, plus the 3 most recent past ones in a collapsed "Past events"
section. Older rows drop off automatically, so there's no need to delete
them (though it keeps the sheet tidy).

The Newsletter tab feeds the newsletter section: the newest edition (by
Date) is featured with a "Check it out" button, and earlier ones sit in a
collapsed "Previous editions" dropdown. The PDF column takes a pasted
link. For a Canva newsletter: Share → Download → PDF in Canva, upload the
PDF to Google Drive, share it "Anyone with the link", and paste that Drive
link into the cell. The section stays hidden until the tab has a row.

### Option B: edit the data files directly

If no sheet is configured (or it ever breaks, or someone deletes it), the
site uses the files in `data/`:

- **`data/exec-team.js`** — the executive team roster
- **`data/events.js`** — the events list

Instructions are at the top of each file. The site also falls back to these
files automatically whenever the sheet can't be reached, so it never shows
a broken page. Keep them roughly current as a safety net.

## Project structure

```
index.html            the whole site (single page)
css/style.css         styles ("Flame Test" palette, see BRAND.md)
js/main.js            renders team + events (sheet or data/), mobile nav
data/config.js        ← Google Sheet ID goes here (one-time setup)
data/exec-team.js     ← fallback exec roster
data/events.js        ← fallback events list
data/newsletters.js   ← fallback newsletter list
assets/               logo (ink + paper variants), team photo, fonts
BRAND.md              visual identity: colors, typography, logo usage
LAYOUT.md             site plan / section spec
```

## Brand quick reference

- Colors: Flame Red `#E4572E`, Ember Orange `#F79824`, Flame Yellow
  `#F7C548`, Bunsen Green `#4C9F70`, Ink `#231F20`, Paper `#FAF8F5`,
  Slate `#6B6864` — accents only, never big color blocks.
- Type: Lastik (display headings), Satoshi (body), JetBrains Mono (small
  technical accents). Lastik and Satoshi are self-hosted in `assets/fonts/`;
  JetBrains Mono comes from Google Fonts.

## Deploying

Any static host works (GitHub Pages, Vercel, Netlify). For GitHub Pages:
repo Settings → Pages → deploy from the `main` branch, root folder.

## Contact

General inquiries: CGSA@ucalgary.ca
