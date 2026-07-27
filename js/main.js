/* CGSA site scripts: mobile nav + rendering exec team and events
   from the editable data files in /data. Volunteers should not
   need to touch this file — edit data/exec-team.js and
   data/events.js instead. */

(function () {
  "use strict";

  /* ---------- helpers ---------- */

  // All rendered data passes through esc() so stray quotes or
  // angle brackets in the data files can't break the page.
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

  /* ---------- exec team ---------- */

  var FLASK_SVG =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
    '<path fill="currentColor" d="M9 2h6v2h-1v5.2l5.5 9.6A2 2 0 0 1 17.8 22H6.2a2 2 0 0 1-1.7-3.2L10 9.2V4H9V2Zm3 2v5.7L8.6 15h6.8L12 9.7V4Z"/></svg>';

  var teamGrid = document.getElementById("team-grid");
  if (teamGrid && typeof EXEC_TEAM !== "undefined") {
    teamGrid.innerHTML = EXEC_TEAM.map(function (member) {
      var isTbd = !member.name || /^tbd$/i.test(member.name.trim());
      var photo = member.photo
        ? '<img src="' + esc(member.photo) + '" alt="" width="56" height="56" loading="lazy">'
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

  /* ---------- events ---------- */

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
    return (
      '<li class="event-card">' + dateTile +
      '<div class="event-body">' +
      "<h3>" + esc(ev.title) + "</h3>" +
      (meta ? '<p class="event-meta">' + esc(meta) + "</p>" : "") +
      (ev.blurb ? '<p class="event-blurb">' + esc(ev.blurb) + "</p>" : "") +
      "</div></li>"
    );
  }

  var upcomingWrap = document.getElementById("events-upcoming");
  if (upcomingWrap && typeof EVENTS !== "undefined") {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var sorted = EVENTS.slice().sort(function (a, b) {
      return String(a.date).localeCompare(String(b.date));
    });
    var upcoming = sorted.filter(function (ev) {
      var d = parseDate(ev.date);
      return !d || d >= today;
    });
    var past = sorted.filter(function (ev) {
      var d = parseDate(ev.date);
      return d && d < today;
    }).reverse();

    upcomingWrap.innerHTML = upcoming.length
      ? '<ul class="event-list">' + upcoming.map(eventCard).join("") + "</ul>"
      : '<p class="events-empty">Nothing on the calendar right now. ' +
        "Check back soon, or watch our socials.</p>";

    var pastWrap = document.getElementById("events-past");
    var pastList = document.getElementById("events-past-list");
    if (past.length && pastWrap && pastList) {
      pastList.innerHTML =
        '<ul class="event-list">' + past.map(eventCard).join("") + "</ul>";
      pastWrap.hidden = false;
    }
  }
})();
