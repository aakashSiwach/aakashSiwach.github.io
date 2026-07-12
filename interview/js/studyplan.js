/* 28-Day Study Plan — offline checklist with progress saved in localStorage. */
(function () {
  "use strict";

  var SP_KEY = "isp_studyplan_v1";     // { dayId: true }
  var SP_OPEN_KEY = "isp_sp_open_v1";  // "1" | "0"

  var PLAN = [
    { week: "Week 1 — Core Java & OOP", days: [
      { id: "d1",  title: "Java fundamentals", tasks: "Platform independence, JDK/JRE/JVM, data types, primitives vs references." },
      { id: "d2",  title: "OOP pillars", tasks: "4 pillars, overloading vs overriding, abstraction vs encapsulation, interface vs abstract class." },
      { id: "d3",  title: "Strings & immutability", tasks: "String vs StringBuilder/Buffer, == vs equals, string pool + the Output & Debugging string questions." },
      { id: "d4",  title: "Collections I", tasks: "ArrayList vs LinkedList, HashMap internals, HashMap vs Hashtable vs ConcurrentHashMap." },
      { id: "d5",  title: "Collections II", tasks: "equals()/hashCode() contract, fail-fast vs fail-safe, Comparable vs Comparator." },
      { id: "d6",  title: "Exceptions", tasks: "Checked vs unchecked, throw vs throws, try-with-resources. + 1 DSA warm-up." },
      { id: "d7",  title: "Review + code", tasks: "Revise Week 1. Solve: reverse string, palindrome, anagram, two sum, missing number." }
    ]},
    { week: "Week 2 — Advanced Java & Concurrency", days: [
      { id: "d8",  title: "Threads basics", tasks: "Thread lifecycle, Runnable vs Callable, Future, why ExecutorService over new Thread()." },
      { id: "d9",  title: "Concurrency", tasks: "synchronized, deadlock & avoidance, volatile vs synchronized vs Atomic." },
      { id: "d10", title: "Java 8 — functional", tasks: "Functional interfaces, lambda expressions, method references." },
      { id: "d11", title: "Java 8 — Streams", tasks: "Stream API, map vs flatMap, collectors, Optional best practices." },
      { id: "d12", title: "JVM & GC", tasks: "Memory areas, class loading, garbage collection & collector types (G1)." },
      { id: "d13", title: "Output & Debugging", tasks: "Parent/child dispatch, field hiding, casting, constructor trap, autoboxing NPE, references." },
      { id: "d14", title: "Review + code", tasks: "Revise Week 2. Solve: valid parentheses, Kadane's max subarray, binary search." }
    ]},
    { week: "Week 3 — Spring, Data & APIs", days: [
      { id: "d15", title: "Spring core", tasks: "IoC & DI (constructor injection), bean scopes & lifecycle, stereotype annotations." },
      { id: "d16", title: "Spring Boot", tasks: "Auto-configuration, starters, profiles, Actuator, Spring MVC request flow." },
      { id: "d17", title: "Data / Hibernate", tasks: "Spring Data JPA, @Transactional (propagation/isolation), the N+1 problem & fixes." },
      { id: "d18", title: "REST APIs", tasks: "HTTP methods, status codes, REST principles, global exception handling (@RestControllerAdvice)." },
      { id: "d19", title: "Spring Security & JWT", tasks: "Auth vs authz, filter chain, JWT (access/refresh), method security, OWASP top risks." },
      { id: "d20", title: "Databases & SQL", tasks: "Indexes, ACID, isolation levels, joins, normalization, DELETE/TRUNCATE/DROP." },
      { id: "d21", title: "Review + SQL/code", tasks: "Revise Week 3. SQL: 2nd highest salary, duplicates. Code: first non-repeating char, reverse linked list." }
    ]},
    { week: "Week 4 — Microservices, System Design & Behavioral", days: [
      { id: "d22", title: "Microservices I", tasks: "Monolith vs micro, sync vs async comms, API gateway, service discovery & config." },
      { id: "d23", title: "Microservices II", tasks: "Saga pattern, idempotency, circuit breaker, observability, database-per-service." },
      { id: "d24", title: "Messaging", tasks: "RabbitMQ concepts & delivery guarantees; Kafka concepts, ordering, delivery semantics, DLT." },
      { id: "d25", title: "System design I", tasks: "Frameworks + design a payment gateway (your Bancstac story), rate limiter, caching." },
      { id: "d26", title: "System design II", tasks: "URL shortener, notification service, e-commerce order service. Practice out loud." },
      { id: "d27", title: "Behavioral", tasks: "Tell me about yourself, project architecture, STAR stories: challenge, conflict, perf, incident, rollback." },
      { id: "d28", title: "Full mock", tasks: "2 coding + 1 system design + behavioral under time. Re-do every question flagged ↻ Revisit." }
    ]}
  ];

  var TOTAL_DAYS = PLAN.reduce(function (n, w) { return n + w.days.length; }, 0);

  function load() {
    try { return JSON.parse(localStorage.getItem(SP_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(state) { localStorage.setItem(SP_KEY, JSON.stringify(state)); }

  var body = document.getElementById("spBody");
  var bar = document.getElementById("spBar");
  var pct = document.getElementById("spPct");
  var toggle = document.getElementById("spToggle");
  var caret = document.getElementById("spCaret");
  if (!body) return; // section not present

  var state = load();
  var dayNum = 0;

  function build() {
    var html = "";
    PLAN.forEach(function (w) {
      html += '<div class="sp-week">' + esc(w.week) + '</div>';
      w.days.forEach(function (d) {
        dayNum++;
        var done = !!state[d.id];
        html += '<label class="sp-day' + (done ? " done" : "") + '" data-id="' + esc(d.id) + '">' +
          '<input type="checkbox"' + (done ? " checked" : "") + ' />' +
          '<span class="sp-daynum">Day ' + dayNum + '</span>' +
          '<span class="sp-daytext"><b>' + esc(d.title) + '</b><small>' + esc(d.tasks) + '</small></span>' +
        '</label>';
      });
    });
    dayNum = 0;
    body.innerHTML = html;
    Array.prototype.forEach.call(body.querySelectorAll(".sp-day"), function (row) {
      row.querySelector("input").addEventListener("change", function () {
        var id = row.getAttribute("data-id");
        if (this.checked) state[id] = true; else delete state[id];
        save(state);
        row.classList.toggle("done", this.checked);
        updateProgress();
      });
    });
    updateProgress();
  }

  function updateProgress() {
    var done = Object.keys(state).length;
    var p = TOTAL_DAYS ? Math.round((done / TOTAL_DAYS) * 100) : 0;
    bar.style.width = p + "%";
    pct.textContent = p + "% (" + done + "/" + TOTAL_DAYS + ")";
  }

  function setOpen(open) {
    body.hidden = !open;
    caret.style.transform = open ? "rotate(90deg)" : "rotate(0deg)";
    localStorage.setItem(SP_OPEN_KEY, open ? "1" : "0");
  }

  toggle.addEventListener("click", function () { setOpen(body.hidden); });
  toggle.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(body.hidden); }
  });

  build();
  setOpen(localStorage.getItem(SP_OPEN_KEY) === "1");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
    });
  }
})();
