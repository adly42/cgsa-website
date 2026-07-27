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

The two things that change every year live in the `data/` folder:

- **`data/exec-team.js`** — the executive team. Edit the names, emails, and
  photo paths in quotes. Instructions are at the top of the file.
- **`data/events.js`** — events. Copy an existing block to add an event.
  Events dated in the past automatically move to "Past events."

Save the file, refresh the page, done.

## Project structure

```
index.html            the whole site (single page)
css/style.css         styles ("Flame Test" palette, see BRAND.md)
js/main.js            renders team + events from data/, mobile nav
data/exec-team.js     ← edit this: exec roster
data/events.js        ← edit this: events
assets/               logo (ink + paper variants), team photo
BRAND.md              visual identity: colors, typography, logo usage
LAYOUT.md             site plan / section spec
```

## Brand quick reference

- Colors: Flame Red `#E4572E`, Ember Orange `#F79824`, Flame Yellow
  `#F7C548`, Bunsen Green `#4C9F70`, Ink `#231F20`, Paper `#FAF8F5`,
  Slate `#6B6864` — accents only, never big color blocks.
- Type: Space Grotesk (headings), Inter (body), JetBrains Mono (small
  technical accents). Loaded from Google Fonts.

## Deploying

Any static host works (GitHub Pages, Vercel, Netlify). For GitHub Pages:
repo Settings → Pages → deploy from the `main` branch, root folder.

## Contact

General inquiries: CGSA@ucalgary.ca
