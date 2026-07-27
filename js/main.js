/* CGSA site scripts: mobile nav + rendering the exec team and
   events. Data comes from a Google Sheet when data/config.js has
   a sheetId, otherwise from data/exec-team.js and data/events.js.
   Volunteers should not need to touch this file. */

(function () {
  "use strict";

  /* ---------- helpers ---------- */

  // All rendered data passes through esc() so stray quotes or
  // angle brackets in the data can't break the page.
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Parse "YYYY-MM-DD" as a local date (new Date(string) would
  // treat it as UTC and shift the day in Calgary).
  function parseDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str).trim());
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }

  /* ---------- mobile nav ---------- */

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a section, and on Escape.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });
  }

  // Accept regular Google Drive share links as photo URLs by
  // rewriting them to Drive's direct-image endpoint. Any other
  // URL passes through untouched.
  //   drive.google.com/file/d/FILE_ID/view...  → thumbnail URL
  //   drive.google.com/open?id=FILE_ID         → thumbnail URL
  function photoUrl(url) {
    url = String(url || "").trim();
    if (!url) return "";
    var m = /drive\.google\.com\/file\/d\/([\w-]+)/.exec(url) ||
      /drive\.google\.com\/(?:open|uc)\?.*id=([\w-]+)/.exec(url);
    return m
      ? "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w800"
      : url;
  }

  /* ---------- exec team rendering ---------- */

  var FLASK_SVG =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
    '<path fill="currentColor" d="M9 2h6v2h-1v5.2l5.5 9.6A2 2 0 0 1 17.8 22H6.2a2 2 0 0 1-1.7-3.2L10 9.2V4H9V2Zm3 2v5.7L8.6 15h6.8L12 9.7V4Z"/></svg>';

  function renderTeam(members) {
    var teamGrid = document.getElementById("team-grid");
    if (!teamGrid || !members || !members.length) return;
    teamGrid.innerHTML = members.map(function (member) {
      var isTbd = !member.name || /^tbd$/i.test(member.name.trim());
      var photo = member.photo
        ? '<img src="' + esc(photoUrl(member.photo)) + '" alt="" width="56" height="56" loading="lazy">'
        : FLASK_SVG;
      var email = member.email
        ? '<a class="team-card-email" href="mailto:' + esc(member.email) + '">' +
          esc(member.email) + "</a>"
        : "";
      return (
        '<li class="team-card">' +
        '<span class="team-card-photo">' + photo + "</span>" +
        "<div>" +
        '<p class="team-card-name' + (isTbd ? " is-tbd" : "") + '">' +
        (isTbd ? "To be announced" : esc(member.name)) + "</p>" +
        '<p class="team-card-role">' + esc(member.role) + "</p>" +
        email +
        "</div></li>"
      );
    }).join("");
  }

  /* ---------- events rendering ---------- */

  function eventCard(ev) {
    var d = parseDate(ev.date);
    var dateTile = d
      ? '<div class="event-date" aria-hidden="true">' +
        '<span class="ed-month">' + MONTHS[d.getMonth()] + "</span>" +
        '<span class="ed-day">' + d.getDate() + "</span>" +
        '<span class="ed-year">' + d.getFullYear() + "</span></div>"
      : "";
    var dateText = d
      ? MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear()
      : "";
    var meta = [dateText, ev.time, ev.location]
      .filter(function (x) { return x && x !== "TBD"; })
      .join(" · ");
    var photo = ev.photo
      ? '<img class="event-photo" src="' + esc(photoUrl(ev.photo)) +
        '" alt="" loading="lazy">'
      : "";
    return (
      '<li class="event-card' + (photo ? " has-photo" : "") + '">' + dateTile +
      '<div class="event-body">' +
      "<h3>" + esc(ev.title) + "</h3>" +
      (meta ? '<p class="event-meta">' + esc(meta) + "</p>" : "") +
      (ev.blurb ? '<p class="event-blurb">' + esc(ev.blurb) + "</p>" : "") +
      "</div>" + photo + "</li>"
    );
  }

  // Upcoming events (today or later) show soonest first, capped
  // at 10. The 3 most recent past events sit in a collapsed
  // "Past events" section; older ones drop off the page.
  var MAX_UPCOMING = 10;
  var MAX_PAST = 3;

  function renderEvents(events) {
    var upcomingWrap = document.getElementById("events-upcoming");
    if (!upcomingWrap || !events) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var sorted = events.slice().sort(function (a, b) {
      return String(a.date).localeCompare(String(b.date));
    });
    var upcoming = sorted.filter(function (ev) {
      var d = parseDate(ev.date);
      return !d || d >= today;
    }).slice(0, MAX_UPCOMING);
    var past = sorted.filter(function (ev) {
      var d = parseDate(ev.date);
      return d && d < today;
    }).reverse().slice(0, MAX_PAST);

    upcomingWrap.innerHTML = upcoming.length
      ? '<ul class="event-list">' + upcoming.map(eventCard).join("") + "</ul>"
      : '<p class="events-empty">Nothing on the calendar right now. ' +
        "Check back soon, or watch our socials.</p>";

    var pastWrap = document.getElementById("events-past");
    var pastList = document.getElementById("events-past-list");
    if (pastWrap && pastList) {
      if (past.length) {
        pastList.innerHTML =
          '<ul class="event-list">' + past.map(eventCard).join("") + "</ul>";
        pastWrap.hidden = false;
      } else {
        pastWrap.hidden = true;
      }
    }
  }

  /* ---------- newsletter rendering ---------- */

  function formatDate(str) {
    var d = parseDate(str);
    return d
      ? MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear()
      : "";
  }

  function renderNewsletters(items) {
    var section = document.getElementById("newsletter");
    var wrap = document.getElementById("newsletter-list");
    if (!section || !wrap || !items) return;

    // Newest first; rows need at least a title and a PDF link.
    var editions = items.filter(function (n) {
      return n.title && n.pdf;
    }).sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });

    if (!editions.length) {
      section.hidden = true;
      return;
    }

    var latest = editions[0];
    var rest = editions.slice(1);

    var html =
      '<div class="newsletter-latest">' +
      "<div>" +
      '<p class="newsletter-latest-label mono">Latest edition</p>' +
      "<h3>" + esc(latest.title) + "</h3>" +
      (latest.date
        ? '<p class="newsletter-date mono">' + esc(formatDate(latest.date)) + "</p>"
        : "") +
      "</div>" +
      '<a class="btn btn-primary" href="' + esc(latest.pdf) +
      '" target="_blank" rel="noopener">Check it out</a>' +
      "</div>";

    if (rest.length) {
      html +=
        '<details class="newsletter-archive">' +
        "<summary>Previous editions</summary>" +
        '<ul class="newsletter-list">' +
        rest.map(function (n) {
          return (
            '<li><a href="' + esc(n.pdf) + '" target="_blank" rel="noopener">' +
            esc(n.title) + "</a>" +
            (n.date
              ? '<span class="newsletter-date mono">' + esc(formatDate(n.date)) + "</span>"
              : "") +
            "</li>"
          );
        }).join("") +
        "</ul></details>";
    }

    wrap.innerHTML = html;
    section.hidden = false;
  }

  /* ---------- Google Sheet loading ---------- */

  // Minimal CSV parser that handles quoted fields, embedded
  // commas, escaped quotes ("") and newlines inside quotes.
  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else {
          field += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(field); field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = "";
        rows.push(row); row = [];
      } else {
        field += ch;
      }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // Turn CSV rows into objects keyed by lowercased header names,
  // skipping fully empty rows.
  function csvToObjects(text) {
    var rows = parseCSV(text);
    if (rows.length < 2) return [];
    var headers = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (cells) {
      var obj = {};
      headers.forEach(function (h, i) {
        if (h) obj[h] = (cells[i] || "").trim();
      });
      return obj;
    }).filter(function (obj) {
      return Object.keys(obj).some(function (k) { return obj[k] !== ""; });
    });
  }

  function fetchSheetTab(sheetId, tabName) {
    var url = "https://docs.google.com/spreadsheets/d/" +
      encodeURIComponent(sheetId) +
      "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(tabName);
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("Sheet tab '" + tabName + "': HTTP " + res.status);
      return res.text();
    }).then(csvToObjects);
  }

  /* ---------- init ---------- */

  var localTeam = typeof EXEC_TEAM !== "undefined" ? EXEC_TEAM : [];
  var localEvents = typeof EVENTS !== "undefined" ? EVENTS : [];
  var localNewsletters = typeof NEWSLETTERS !== "undefined" ? NEWSLETTERS : [];
  var sheetId =
    typeof SITE_CONFIG !== "undefined" && SITE_CONFIG && SITE_CONFIG.sheetId
      ? String(SITE_CONFIG.sheetId).trim()
      : "";

  if (!sheetId) {
    renderTeam(localTeam);
    renderEvents(localEvents);
    renderNewsletters(localNewsletters);
    return;
  }

  // Sheet configured: try it first, fall back to the local data
  // files if it's unreachable, empty, or misconfigured.
  Promise.all([
    fetchSheetTab(sheetId, "Exec"),
    fetchSheetTab(sheetId, "Events")
  ]).then(function (results) {
    var team = results[0];
    var events = results[1];
    renderTeam(team.length ? team : localTeam);
    renderEvents(events.length ? events : localEvents);
  }).catch(function (err) {
    if (window.console) console.warn("CGSA: falling back to local data.", err);
    renderTeam(localTeam);
    renderEvents(localEvents);
  });

  // Newsletter loads on its own so a missing/renamed tab can
  // never take the team or events down with it.
  fetchSheetTab(sheetId, "Newsletter").then(function (items) {
    renderNewsletters(items.length ? items : localNewsletters);
  }).catch(function () {
    renderNewsletters(localNewsletters);
  });
})();
