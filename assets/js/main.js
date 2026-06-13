/* =========================================================
   main.js — interactions, animations, SEO-friendly progressive UX
   ========================================================= */
(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeBtn");
  const stored = localStorage.getItem("theme");
  if (stored) root.setAttribute("data-theme", stored);
  const syncThemeIcon = () =>
    themeBtn.innerHTML = root.getAttribute("data-theme") === "light"
      ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  syncThemeIcon();
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncThemeIcon();
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = $("#navToggle"), navLinks = $("#navLinks");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  /* ---------- Scroll progress + active link ---------- */
  const progress = $("#progress");
  const sections = $$("main section[id]");
  const linkMap = new Map($$("#navLinks a").map(a => [a.getAttribute("href").slice(1), a]));
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    let current = "";
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= 120) current = sec.id;
    }
    linkMap.forEach((a, id) => a.classList.toggle("active", id === current));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add("in"));
    animateBars(); animateCounts();
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          if (e.target.querySelector?.("[data-count]") || e.target.matches?.("[data-count]")) {}
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.16 });
    revealEls.forEach(el => io.observe(el));

    // bars + counters trigger when their section enters
    const trigger = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        if (e.target.id === "skills") animateBars();
        if (e.target.querySelector("[data-count]")) animateCounts(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    const skills = $("#skills"); if (skills) trigger.observe(skills);
    $$(".stats").forEach(s => trigger.observe(s));
  }

  function animateBars() {
    $$(".bar > span").forEach(s => { s.style.width = (s.dataset.w || 0) + "%"; });
  }
  function animateCounts(scope = document) {
    $$("[data-count]", scope).forEach(el => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const dur = 1400; const start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- Hero typing effect ---------- */
  const phrases = [
    "scalable backends.", "payment gateways.", "no-code platforms.",
    "clean APIs in Java.", "fast apps in React.", "things people use."
  ];
  const typedEl = $("#typed");
  if (typedEl && !reduceMotion) {
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = phrases[pi];
      typedEl.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) ci++;
      else if (deleting && ci > 0) ci--;
      else if (!deleting && ci === word.length) { deleting = true; return setTimeout(tick, 1400); }
      else { deleting = false; pi = (pi + 1) % phrases.length; }
      setTimeout(tick, deleting ? 45 : 85);
    };
    tick();
  } else if (typedEl) {
    typedEl.textContent = phrases[0];
  }

  /* ---------- Download CV (print to PDF) ---------- */
  const printCV = () => window.print();
  $("#cvBtn")?.addEventListener("click", printCV);
  $("#cvBtn2")?.addEventListener("click", printCV);

  /* ---------- Contact form (mailto, no backend) ---------- */
  const form = $("#contactForm");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#cf-name").value.trim();
    const email = $("#cf-email").value.trim();
    const msg = $("#cf-msg").value.trim();
    if (!name || !email || !msg) return toast("Please fill in all fields.");
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:aakashsiwach19@gmail.com?subject=${subject}&body=${body}`;
    toast("Opening your email client… ✉️");
    form.reset();
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  const toastEl = $("#toast");
  window.toast = function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };

  /* ---------- Particle background canvas ---------- */
  const canvas = $("#bg-canvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, pts, raf;
    const COUNT = () => Math.min(90, Math.floor(window.innerWidth / 16));
    const accent = () => getComputedStyle(root).getPropertyValue("--accent").trim() || "#22d3ee";
    function resize() {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      pts = Array.from({ length: COUNT() }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        r: (Math.random() * 1.6 + 0.6) * devicePixelRatio
      }));
    }
    const mouse = { x: -9999, y: -9999 };
    window.addEventListener("mousemove", e => { mouse.x = e.clientX * devicePixelRatio; mouse.y = e.clientY * devicePixelRatio; });
    window.addEventListener("mouseout", () => { mouse.x = mouse.y = -9999; });
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const col = accent();
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col + "cc"; ctx.fill();
      }
      const linkDist = 130 * devicePixelRatio;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            ctx.globalAlpha = (1 - d / linkDist) * 0.5;
            ctx.strokeStyle = col; ctx.lineWidth = devicePixelRatio * 0.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
        const dm = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
        if (dm < linkDist * 1.4) {
          ctx.globalAlpha = (1 - dm / (linkDist * 1.4)) * 0.6;
          ctx.strokeStyle = col; ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }

  /* ---------- Konami code ---------- */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  window.addEventListener("keydown", e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kIdx = (key === KONAMI[kIdx]) ? kIdx + 1 : (key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) { kIdx = 0; partyMode(); }
  });
  function partyMode() {
    toast("🎉 Konami unlocked — confetti mode!");
    if (reduceMotion) return;
    const colors = ["#22d3ee","#a78bfa","#f472b6","#34d399","#fbbf24"];
    for (let i = 0; i < 120; i++) {
      const c = document.createElement("div");
      Object.assign(c.style, {
        position: "fixed", top: "-10px", left: Math.random() * 100 + "vw",
        width: "9px", height: "9px", background: colors[i % colors.length],
        zIndex: 999, borderRadius: Math.random() > .5 ? "50%" : "2px",
        transform: `rotate(${Math.random() * 360}deg)`, pointerEvents: "none"
      });
      document.body.appendChild(c);
      const fall = 2400 + Math.random() * 1600;
      c.animate(
        [{ transform: c.style.transform + " translateY(0)", opacity: 1 },
         { transform: `translateY(105vh) rotate(${Math.random()*720}deg)`, opacity: 1 }],
        { duration: fall, easing: "cubic-bezier(.3,.6,.4,1)" }
      ).onfinish = () => c.remove();
    }
  }

  /* ---------- Terminal easter egg ('~' to toggle) ---------- */
  const term = $("#terminal"), termBody = $("#term-body"), termInput = $("#term-input");
  const print = (html, cls = "") => {
    const line = document.createElement("div");
    if (cls) line.className = cls;
    line.innerHTML = html;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  };
  const commands = {
    help: () => `Available: <span class="pl">about, skills, experience, projects, social, school, game, clear, sudo, exit</span>`,
    about: () => "Aakash Siwach — Full-Stack SDE, 4+ yrs. Java · Node · React · AWS. Based in Meerut, India.",
    skills: () => "Java/Spring, Node.js, React/TS, AWS, Microservices, SQL+NoSQL, Docker, CI/CD.",
    experience: () => "SDE I @ Innostax (2022–now) · Dev @ Paramarsh Informatics (2021–2022).",
    projects: () => "New Era World School (live) · No-code backend · Banking backend · Travel platform.",
    social: () => 'github.com/aakashSiwach · linkedin.com/in/aakashsiwach19',
    school: () => 'I build & maintain → <a href="https://neweraworldschool.in/" target="_blank" rel="noopener">neweraworldschool.in</a>',
    game: () => { document.querySelector("#games").scrollIntoView({ behavior: "smooth" }); return "Loading games… 🎮"; },
    sudo: () => "Nice try 😏 — you don't have permission to hire yourself.",
    clear: () => { termBody.innerHTML = ""; return ""; },
    exit: () => { closeTerm(); return ""; }
  };
  function openTerm() {
    term.classList.add("open"); term.setAttribute("aria-hidden", "false");
    if (!termBody.childElementCount) {
      print('Welcome to <span class="pl">aakash.sh</span> 👋  Type <span class="pl">help</span> to start.');
    }
    termInput.focus();
  }
  function closeTerm() { term.classList.remove("open"); term.setAttribute("aria-hidden", "true"); }
  window.addEventListener("keydown", e => {
    const typing = /input|textarea/i.test(document.activeElement?.tagName || "");
    if ((e.key === "~" || e.key === "`") && !typing) { e.preventDefault(); term.classList.contains("open") ? closeTerm() : openTerm(); }
    if (e.key === "Escape" && term.classList.contains("open")) closeTerm();
  });
  termInput?.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const raw = termInput.value.trim(); termInput.value = "";
    if (!raw) return;
    print(`<span class="pl">$</span> ${raw.replace(/</g,"&lt;")}`);
    const out = commands[raw.toLowerCase()];
    print(out ? out() : `command not found: ${raw.replace(/</g,"&lt;")} — try <span class="pl">help</span>`);
  });
})();
