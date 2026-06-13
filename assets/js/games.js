/* =========================================================
   games.js — Bug Squasher · Code Typing Test · Memory Match
   Pure vanilla JS. High scores persist in localStorage.
   ========================================================= */
(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const ls = {
    get: (k, d) => { const v = localStorage.getItem(k); return v === null ? d : v; },
    set: (k, v) => localStorage.setItem(k, v)
  };

  /* ---------- Tab switching ---------- */
  const tabs = $$(".tab-btn");
  const panels = { bug: $("#game-bug"), type: $("#game-type"), memory: $("#game-memory") };
  tabs.forEach(btn => btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    Object.values(panels).forEach(p => p.classList.remove("active"));
    panels[btn.dataset.game].classList.add("active");
  }));

  /* =====================================================
     1) BUG SQUASHER
     ===================================================== */
  (() => {
    const arena = $("#bug-arena"), overlay = $("#bug-overlay"), startBtn = $("#bug-start");
    const scoreEl = $("#bug-score"), timeEl = $("#bug-time"), bestEl = $("#bug-best");
    const BUGS = ["🐛","🐞","🪲","🦗","🕷️","🐜"];
    let score = 0, time = 30, running = false, spawnT, tickT, best = +ls.get("bugBest", 0);
    bestEl.textContent = best;

    function spawn() {
      if (!running) return;
      const golden = Math.random() < 0.12;
      const bug = document.createElement("div");
      bug.className = "bug" + (golden ? " golden" : "");
      bug.textContent = golden ? "⭐" : BUGS[(Math.random() * BUGS.length) | 0];
      const pad = 30;
      bug.style.left = pad + Math.random() * (arena.clientWidth - pad * 2) + "px";
      bug.style.top  = pad + Math.random() * (arena.clientHeight - pad * 2) + "px";
      bug.style.transform = `rotate(${Math.random() * 360}deg)`;
      const kill = e => {
        e.stopPropagation();
        if (!bug.isConnected) return;
        score += golden ? 5 : 1;
        scoreEl.textContent = score;
        bug.style.transition = "transform .12s, opacity .12s";
        bug.style.opacity = "0"; bug.style.transform += " scale(2)";
        setTimeout(() => bug.remove(), 120);
      };
      bug.addEventListener("pointerdown", kill);
      arena.appendChild(bug);
      const life = golden ? 750 : 1100 + Math.random() * 700;
      setTimeout(() => bug.remove(), life);
      spawnT = setTimeout(spawn, golden ? 700 : 380 + Math.random() * 320);
    }

    function start() {
      score = 0; time = 30; running = true;
      scoreEl.textContent = 0; timeEl.textContent = 30;
      overlay.style.display = "none";
      $$(".bug", arena).forEach(b => b.remove());
      spawn();
      tickT = setInterval(() => {
        time--; timeEl.textContent = time;
        if (time <= 0) end();
      }, 1000);
    }
    function end() {
      running = false; clearTimeout(spawnT); clearInterval(tickT);
      $$(".bug", arena).forEach(b => b.remove());
      if (score > best) { best = score; ls.set("bugBest", best); bestEl.textContent = best; window.toast?.("🏆 New high score: " + best + "!"); }
      overlay.style.display = "grid";
      overlay.innerHTML = `<div>
        <p style="font-size:1.3rem;font-weight:800;">Time's up! 🐞</p>
        <p style="color:var(--muted);margin:6px 0 16px;">You squashed <b style="color:var(--accent)">${score}</b> bugs · Best: <b>${best}</b></p>
        <button class="btn btn-primary" id="bug-again"><i class="fa-solid fa-rotate-right"></i> Play again</button>
      </div>`;
      $("#bug-again").addEventListener("click", start);
    }
    startBtn.addEventListener("click", start);
  })();

  /* =====================================================
     2) CODE TYPING SPEED TEST
     ===================================================== */
  (() => {
    const display = $("#type-text"), input = $("#type-input");
    const wpmEl = $("#type-wpm"), accEl = $("#type-acc"), bestEl = $("#type-best");
    const newBtn = $("#type-new"), resetBtn = $("#type-reset");
    const SNIPPETS = [
      `const sum = arr => arr.reduce((a, b) => a + b, 0);`,
      `public int add(int a, int b) { return a + b; }`,
      `app.get("/api", (req, res) => res.json({ ok: true }));`,
      `SELECT name FROM users WHERE active = true ORDER BY id;`,
      `for (let i = 0; i < n; i++) console.log(i * i);`,
      `docker run -d -p 8080:80 --name web nginx:alpine`,
      `const data = await fetch(url).then(r => r.json());`,
      `git commit -m "feat: ship the new portfolio"`
    ];
    let target = "", startTime = null, finished = false;
    let best = +ls.get("typeBest", 0); bestEl.textContent = best;

    function load() {
      target = SNIPPETS[(Math.random() * SNIPPETS.length) | 0];
      startTime = null; finished = false;
      input.disabled = false; input.value = ""; input.focus();
      wpmEl.textContent = 0; accEl.textContent = 100;
      render();
    }
    function render() {
      const typed = input.value;
      let html = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i].replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
        let cls = "";
        if (i < typed.length) cls = typed[i] === target[i] ? "ok" : "bad";
        else if (i === typed.length) cls = "cur";
        html += `<span class="${cls}">${ch}</span>`;
      }
      display.innerHTML = html;
    }
    input.addEventListener("input", () => {
      if (finished) return;
      if (startTime === null && input.value.length) startTime = performance.now();
      render();
      const typed = input.value;
      let correct = 0;
      for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
      const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
      accEl.textContent = acc;
      const mins = (performance.now() - startTime) / 60000;
      const wpm = mins > 0 ? Math.max(0, Math.round((typed.length / 5) / mins)) : 0;
      wpmEl.textContent = wpm;
      if (typed.length >= target.length) finish(wpm, acc);
    });
    function finish(wpm, acc) {
      finished = true; input.disabled = true;
      if (wpm > best) { best = wpm; ls.set("typeBest", best); bestEl.textContent = best; }
      window.toast?.(`Done! ${wpm} WPM · ${acc}% accuracy`);
    }
    newBtn.addEventListener("click", load);
    resetBtn.addEventListener("click", () => {
      startTime = null; finished = false; input.disabled = false;
      input.value = ""; wpmEl.textContent = 0; accEl.textContent = 100; render(); input.focus();
    });
  })();

  /* =====================================================
     3) TECH MEMORY MATCH
     ===================================================== */
  (() => {
    const grid = $("#mem-grid"), movesEl = $("#mem-moves"), pairsEl = $("#mem-pairs"), bestEl = $("#mem-best"), newBtn = $("#mem-new");
    const ICONS = ["fa-java","fa-js","fa-react","fa-node-js","fa-docker","fa-aws","fa-angular","fa-git-alt"];
    let first = null, lock = false, moves = 0, pairs = 0;
    let best = ls.get("memBest", "—"); bestEl.textContent = best;

    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

    function build() {
      grid.innerHTML = ""; first = null; lock = false; moves = 0; pairs = 0;
      movesEl.textContent = 0; pairsEl.textContent = 0;
      const deck = shuffle([...ICONS, ...ICONS]);
      deck.forEach(icon => {
        const card = document.createElement("div");
        card.className = "mcard"; card.dataset.icon = icon;
        card.innerHTML = `
          <div class="face front"><i class="fa-solid fa-question"></i></div>
          <div class="face back"><i class="fab ${icon}"></i></div>`;
        card.addEventListener("click", () => flip(card));
        grid.appendChild(card);
      });
    }
    function flip(card) {
      if (lock || card.classList.contains("flip") || card.classList.contains("matched")) return;
      card.classList.add("flip");
      if (!first) { first = card; return; }
      moves++; movesEl.textContent = moves;
      if (first.dataset.icon === card.dataset.icon) {
        first.classList.add("matched"); card.classList.add("matched");
        first = null; pairs++; pairsEl.textContent = pairs;
        if (pairs === ICONS.length) win();
      } else {
        lock = true;
        setTimeout(() => {
          first.classList.remove("flip"); card.classList.remove("flip");
          first = null; lock = false;
        }, 720);
      }
    }
    function win() {
      const prev = parseInt(best, 10);
      if (isNaN(prev) || moves < prev) { best = moves; ls.set("memBest", best); bestEl.textContent = best; }
      window.toast?.(`🎉 Solved in ${moves} moves!`);
    }
    newBtn.addEventListener("click", build);
    build();
  })();
})();
