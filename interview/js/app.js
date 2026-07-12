/* Interview Study Plan — offline app logic. No frameworks, no network. */
(function () {
  "use strict";

  var STORAGE_KEY = "isp_progress_v1";
  var PREFS_KEY = "isp_prefs_v1";

  // ---- State ----
  var progress = load(STORAGE_KEY, {});      // { id: "done" | "revisit" }
  var prefs = load(PREFS_KEY, { theme: "light", lang: "both", cat: "all", status: "all", query: "" });

  var els = {
    catList: document.getElementById("categoryList"),
    container: document.getElementById("questionContainer"),
    empty: document.getElementById("emptyState"),
    search: document.getElementById("search"),
    overallBar: document.getElementById("overallBar"),
    overallPct: document.getElementById("overallPct"),
    doneCount: document.getElementById("doneCount"),
    totalCount: document.getElementById("totalCount"),
    revisitCount: document.getElementById("revisitCount"),
    langLabel: document.getElementById("langLabel")
  };

  // ---- Init ----
  document.documentElement.setAttribute("data-theme", prefs.theme);
  els.search.value = prefs.query || "";
  applyLangLabel();
  buildCategories();
  render();
  wireEvents();

  // ---- Persistence helpers ----
  function load(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v || fallback; }
    catch (e) { return fallback; }
  }
  function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function savePrefs() { save(PREFS_KEY, prefs); }
  function saveProgress() { save(STORAGE_KEY, progress); }

  // ---- Categories ----
  function categories() {
    var seen = [];
    QUESTIONS.forEach(function (q) { if (seen.indexOf(q.category) === -1) seen.push(q.category); });
    return seen;
  }

  function buildCategories() {
    var cats = categories();
    var html = '<li class="cat-item ' + (prefs.cat === "all" ? "active" : "") +
      '" data-cat="all">All topics <span class="cat-count">' + QUESTIONS.length + "</span></li>";
    cats.forEach(function (c) {
      var total = QUESTIONS.filter(function (q) { return q.category === c; }).length;
      var done = QUESTIONS.filter(function (q) { return q.category === c && progress[q.id] === "done"; }).length;
      html += '<li class="cat-item ' + (prefs.cat === c ? "active" : "") + '" data-cat="' + esc(c) + '">' +
        esc(c) + ' <span class="cat-count">' + done + "/" + total + "</span></li>";
    });
    els.catList.innerHTML = html;
    Array.prototype.forEach.call(els.catList.querySelectorAll(".cat-item"), function (li) {
      li.addEventListener("click", function () {
        prefs.cat = li.getAttribute("data-cat"); savePrefs();
        buildCategories(); render();
      });
    });
  }

  // ---- Filtering ----
  function filtered() {
    var q = (prefs.query || "").toLowerCase().trim();
    return QUESTIONS.filter(function (item) {
      if (prefs.cat !== "all" && item.category !== prefs.cat) return false;
      var st = progress[item.id] || "todo";
      if (prefs.status === "todo" && st !== "todo") return false;
      if (prefs.status === "done" && st !== "done") return false;
      if (prefs.status === "revisit" && st !== "revisit") return false;
      if (q) {
        var hay = (item.question + " " + item.category + " " + (item.tags || []).join(" ") + " " +
          item.answerEn + " " + item.answerHi).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  // ---- Render ----
  function render() {
    var list = filtered();
    updateStats();
    if (!list.length) { els.container.innerHTML = ""; els.empty.hidden = false; return; }
    els.empty.hidden = true;

    var html = "";
    list.forEach(function (item, idx) {
      var st = progress[item.id] || "todo";
      var cls = st === "done" ? "done" : st === "revisit" ? "revisit" : "";
      html += '<article class="qcard ' + cls + '" data-id="' + esc(item.id) + '">' +
        '<div class="qhead">' +
          '<span class="expand-ico">▶</span>' +
          '<div class="qmeta">' +
            '<div class="qtags">' +
              '<span class="tag">' + esc(item.category) + '</span>' +
              '<span class="tag diff-' + item.difficulty + '">' + capitalize(item.difficulty) + '</span>' +
              (st === "done" ? '<span class="tag" style="color:var(--done)">✓ Done</span>' : '') +
              (st === "revisit" ? '<span class="tag" style="color:var(--revisit)">↻ Revisit</span>' : '') +
            '</div>' +
            '<div class="qtitle"><span class="qnum">Q' + (idx + 1) + '.</span>' + esc(item.question) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="qbody">' + answerHtml(item) +
          '<div class="qactions">' +
            '<button class="btn mark-done ' + (st === "done" ? "active-done" : "") + '">✓ ' + (st === "done" ? "Marked done" : "Mark as done") + '</button>' +
            '<button class="btn mark-revisit ' + (st === "revisit" ? "active-revisit" : "") + '">↻ ' + (st === "revisit" ? "Marked revisit" : "Revisit later") + '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    });
    els.container.innerHTML = html;
    wireCards();
  }

  function answerHtml(item) {
    var showEn = prefs.lang === "both" || prefs.lang === "en";
    var showHi = prefs.lang === "both" || prefs.lang === "hi";
    var out = "";
    if (item.codeTop) out += '<div class="code-q"><span class="answer-label label-code">Code — what\'s the output?</span><pre>' + esc(item.codeTop) + '</pre></div>';
    if (showEn) out += '<div class="answer-block"><span class="answer-label label-en">English</span>' + item.answerEn + '</div>';
    if (item.code) out += '<pre>' + esc(item.code) + '</pre>';
    if (showHi) out += '<div class="answer-block"><span class="answer-label label-hi">हिंदी</span>' + item.answerHi + '</div>';
    return out;
  }

  function wireCards() {
    Array.prototype.forEach.call(els.container.querySelectorAll(".qcard"), function (card) {
      var id = card.getAttribute("data-id");
      card.querySelector(".qhead").addEventListener("click", function () { card.classList.toggle("open"); });
      card.querySelector(".mark-done").addEventListener("click", function (e) {
        e.stopPropagation(); toggle(id, "done");
      });
      card.querySelector(".mark-revisit").addEventListener("click", function (e) {
        e.stopPropagation(); toggle(id, "revisit");
      });
    });
  }

  function toggle(id, state) {
    if (progress[id] === state) delete progress[id];
    else progress[id] = state;
    saveProgress();
    buildCategories();
    render();
  }

  function updateStats() {
    var total = QUESTIONS.length;
    var done = 0, revisit = 0;
    QUESTIONS.forEach(function (q) {
      if (progress[q.id] === "done") done++;
      else if (progress[q.id] === "revisit") revisit++;
    });
    var pct = total ? Math.round((done / total) * 100) : 0;
    els.overallBar.style.width = pct + "%";
    els.overallPct.textContent = pct + "%";
    els.doneCount.textContent = done;
    els.totalCount.textContent = total;
    els.revisitCount.textContent = revisit;
  }

  // ---- Events ----
  function wireEvents() {
    els.search.addEventListener("input", function () {
      prefs.query = els.search.value; savePrefs(); render();
    });
    Array.prototype.forEach.call(document.querySelectorAll("#statusFilters .chip"), function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll("#statusFilters .chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        prefs.status = chip.getAttribute("data-status"); savePrefs(); render();
      });
      if (chip.getAttribute("data-status") === prefs.status) {
        document.querySelectorAll("#statusFilters .chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
      }
    });

    document.getElementById("themeToggle").addEventListener("click", function () {
      prefs.theme = prefs.theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", prefs.theme); savePrefs();
    });

    document.getElementById("langToggle").addEventListener("click", function () {
      prefs.lang = prefs.lang === "both" ? "en" : prefs.lang === "en" ? "hi" : "both";
      applyLangLabel(); savePrefs(); render();
    });

    document.getElementById("resetProgress").addEventListener("click", function () {
      if (confirm("Clear ALL progress? This cannot be undone.\nसारी progress मिट जाएगी — पक्का?")) {
        progress = {}; saveProgress(); buildCategories(); render();
      }
    });

    document.getElementById("exportProgress").addEventListener("click", function () {
      var blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "interview-progress-backup.json";
      a.click();
    });

    document.getElementById("importProgress").addEventListener("change", function (e) {
      var file = e.target.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          progress = data || {}; saveProgress(); buildCategories(); render();
          alert("Progress restored! ✓");
        } catch (err) { alert("Invalid backup file."); }
      };
      reader.readAsText(file);
    });
  }

  function applyLangLabel() {
    els.langLabel.textContent = prefs.lang === "both" ? "EN + हिं" : prefs.lang === "en" ? "EN only" : "हिं only";
  }

  // ---- Utils ----
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
  }); }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
})();
