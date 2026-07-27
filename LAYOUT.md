# CGSA Website — Site Plan

## Pages / Sections

1. **Home**
   - Hero: logo mark, "Chemistry Graduate Students' Association — University
     of Calgary," flame-gradient accent divider, short mission line, CTA
     ("Get Involved" / upcoming event)
   - Quick links: About, Events, Exec Team, Contact
   - Highlight strip: "All grad students in Chemistry are automatically
     members"

2. **About**
   - Mission statement (from official page)
   - What CGSA does: monthly meetings, advocacy, social events
   - Link/summary of the Constitution
   - Logo story (optional): periodic element block + flask

3. **Executive Team**
   - Grid of exec cards: name, role, photo (placeholder), email
   - Roles to include (per constitution structure): President, Vice
     President, Resource Administrator, Social Media & Marketing Admin, Peer
     Support Coordinators, Safety Improvement Team Reps, Event Coordinators
   - **Data placeholder only** — current roster from the UCalgary page is
     outdated (doesn't list Youssef as President). Build this as an
     easy-to-edit data block (e.g. JSON/config) so real names can be dropped
     in once confirmed.

4. **Events**
   - Upcoming events list/calendar (date, title, location, blurb)
   - Past events archive (optional, phase 2)

5. **Get Involved**
   - Volunteer opportunities (e.g. Event Coordinator)
   - Annual elections info (President & Resource Administrator, held spring)
   - Peer support / safety contacts

6. **Contact**
   - General inquiries: CGSA@ucalgary.ca
   - Social links: Instagram (@cgsa.ucalgary), TikTok (@ucalgarycgsa) —
     the CGSA has no X, Facebook, LinkedIn, or YouTube presence
   - Location: Department of Chemistry, University of Calgary

## Notes for build

- Mobile-first, single-column stacking of the above sections is fine for v1
- Use flame-gradient (red→orange→yellow) sparingly as section dividers/accents,
  not full backgrounds
- Exec team + events data should live in structured, easily editable
  files (JSON/YAML/MDX) — CGSA will hand this off to student volunteers
  year over year
- Static site is fine (no auth/backend needed) — deploy target TBD (Vercel/
  GitHub Pages)
