/* Question bank — tailored to Aakash Siwach's resume.
   Each item: id, category, difficulty (easy|medium|hard), question, answerEn (HTML), answerHi (HTML), optional code.
   Add your own questions by copying an object below. */
var QUESTIONS = [

/* ============================ JAVA CORE ============================ */
{
  id: "java-1", category: "Java Core", difficulty: "medium",
  question: "How does HashMap work internally in Java?",
  answerEn: "<p>A <code class='inline'>HashMap</code> stores key-value pairs in an array of <b>buckets</b>. Steps:</p><ul><li>It calls <code class='inline'>hashCode()</code> on the key, then applies an internal hash spread, then <code class='inline'>index = hash &amp; (n-1)</code> to find the bucket.</li><li>If the bucket is empty, the entry goes in. If not, it's a <b>collision</b> — entries form a linked list.</li><li>Since Java 8, when a bucket's list length exceeds <b>8</b> (and capacity ≥ 64), it converts to a <b>balanced red-black tree</b>, improving worst-case lookup from O(n) to O(log n).</li><li>Default capacity is 16, load factor 0.75 — when size exceeds capacity×0.75 it <b>resizes</b> (doubles) and rehashes.</li></ul><p><b>Key point:</b> a correct <code class='inline'>equals()</code>/<code class='inline'>hashCode()</code> contract is mandatory, else keys get lost.</p>",
  answerHi: "<p><code class='inline'>HashMap</code> data ko <b>buckets</b> के array में रखता है (key-value pairs).</p><ul><li>पहले key का <code class='inline'>hashCode()</code> लेता है, फिर hashing करके bucket index निकालता है।</li><li>अगर bucket खाली है तो entry वहीं चली जाती है। अगर पहले से कुछ है तो <b>collision</b> होता है और linked list बन जाती है।</li><li>Java 8 से अगर एक bucket में 8 से ज़्यादा entries हो जाएँ (और capacity ≥ 64) तो वो <b>red-black tree</b> बन जाती है — जिससे lookup O(n) से O(log n) हो जाता है।</li><li>Default capacity 16, load factor 0.75 — जब entries इससे ज़्यादा हों तो map <b>resize</b> (double) होकर rehash करता है।</li></ul><p><b>याद रखें:</b> सही <code class='inline'>equals()</code> और <code class='inline'>hashCode()</code> होना ज़रूरी है, वरना keys खो सकती हैं।</p>"
},
{
  id: "java-2", category: "Java Core", difficulty: "medium",
  question: "Difference between HashMap, ConcurrentHashMap and synchronizedMap?",
  answerEn: "<ul><li><b>HashMap</b> — not thread-safe. Fast, but concurrent modification can corrupt it or throw <code class='inline'>ConcurrentModificationException</code>.</li><li><b>Collections.synchronizedMap</b> — wraps a map and locks the <b>entire map</b> on every operation. Thread-safe but poor concurrency (one lock).</li><li><b>ConcurrentHashMap</b> — thread-safe with much better throughput. It locks only a <b>segment/bucket</b> (bucket-level CAS + synchronized in Java 8), so multiple threads read/write different buckets in parallel. Never allows null keys/values.</li></ul><p>For multi-threaded services (like your payment backend) prefer <b>ConcurrentHashMap</b>.</p>",
  answerHi: "<ul><li><b>HashMap</b> — thread-safe नहीं है। तेज़ है पर एक साथ कई threads use करें तो data corrupt हो सकता है।</li><li><b>synchronizedMap</b> — पूरे map पर lock लगाता है, इसलिए thread-safe तो है पर slow (एक ही lock)।</li><li><b>ConcurrentHashMap</b> — thread-safe है और performance अच्छी है क्योंकि ये पूरे map की जगह सिर्फ़ <b>bucket-level</b> lock लगाता है। कई threads अलग-अलग buckets पर एक साथ काम कर सकते हैं। null key/value allow नहीं करता।</li></ul><p>Payment जैसे multi-threaded backend में <b>ConcurrentHashMap</b> ही best है।</p>"
},
{
  id: "java-3", category: "Java Core", difficulty: "medium",
  question: "Explain the equals() and hashCode() contract.",
  answerEn: "<p>The contract that ties them together:</p><ul><li>If two objects are <b>equal</b> (<code class='inline'>a.equals(b)</code> is true), they <b>must</b> return the same <code class='inline'>hashCode()</code>.</li><li>If two objects have the same hashCode, they are <b>not necessarily</b> equal (collisions are allowed).</li><li><code class='inline'>equals()</code> must be reflexive, symmetric, transitive, and consistent.</li></ul><p><b>Why it matters:</b> hash-based collections (HashMap/HashSet) first use hashCode to find the bucket, then equals to confirm. Override one without the other and lookups silently fail.</p>",
  answerHi: "<p>दोनों का आपस में contract:</p><ul><li>अगर दो objects <b>equal</b> हैं (<code class='inline'>a.equals(b)</code> true), तो उनका <code class='inline'>hashCode()</code> <b>ज़रूर</b> एक जैसा होना चाहिए।</li><li>अगर hashCode एक जैसा है तो objects equal हों — ये ज़रूरी नहीं (collision हो सकता है)।</li><li><code class='inline'>equals()</code> reflexive, symmetric, transitive और consistent होना चाहिए।</li></ul><p><b>क्यों ज़रूरी:</b> HashMap/HashSet पहले hashCode से bucket ढूँढते हैं फिर equals से confirm करते हैं। दोनों में से एक ही override करें तो lookup चुपचाप fail हो जाता है।</p>"
},
{
  id: "java-4", category: "Java Core", difficulty: "hard",
  question: "How do you handle concurrency in Java? (threads, executors, CompletableFuture)",
  answerEn: "<ul><li><b>Never create raw threads</b> in production — use an <code class='inline'>ExecutorService</code> thread pool (<code class='inline'>Executors.newFixedThreadPool</code>) so you control resource usage.</li><li><b>CompletableFuture</b> for async pipelines — chain with <code class='inline'>thenApply</code>, <code class='inline'>thenCompose</code>, combine with <code class='inline'>allOf</code>, handle errors with <code class='inline'>exceptionally</code>.</li><li><b>Synchronization:</b> <code class='inline'>synchronized</code> / <code class='inline'>ReentrantLock</code> for mutual exclusion; <code class='inline'>volatile</code> for visibility of a single flag; <code class='inline'>Atomic*</code> classes for lock-free counters.</li><li>Prefer <b>immutable objects</b> and concurrent collections to avoid shared mutable state altogether.</li></ul>",
  answerHi: "<ul><li>Production में <b>सीधे threads मत बनाओ</b> — <code class='inline'>ExecutorService</code> (thread pool) use करो ताकि resources control में रहें।</li><li>Async काम के लिए <b>CompletableFuture</b> — <code class='inline'>thenApply</code>, <code class='inline'>thenCompose</code>, <code class='inline'>allOf</code> से chain करो, errors के लिए <code class='inline'>exceptionally</code>।</li><li><b>Synchronization:</b> mutual exclusion के लिए <code class='inline'>synchronized</code>/<code class='inline'>ReentrantLock</code>; एक flag की visibility के लिए <code class='inline'>volatile</code>; counters के लिए <code class='inline'>Atomic</code> classes।</li><li>सबसे अच्छा — <b>immutable objects</b> और concurrent collections use करो ताकि shared mutable state ही न रहे।</li></ul>",
  code: "ExecutorService pool = Executors.newFixedThreadPool(10);\nCompletableFuture<Order> f = CompletableFuture\n    .supplyAsync(() -> fetchOrder(id), pool)\n    .thenApply(order -> enrich(order))\n    .exceptionally(ex -> fallbackOrder());"
},
{
  id: "java-5", category: "Java Core", difficulty: "medium",
  question: "What are Java 8 Streams and when should you use them?",
  answerEn: "<p>Streams provide a <b>declarative, functional</b> way to process collections — filter, map, reduce — without manual loops.</p><ul><li><b>Intermediate ops</b> (lazy): <code class='inline'>filter</code>, <code class='inline'>map</code>, <code class='inline'>sorted</code>.</li><li><b>Terminal ops</b> (trigger execution): <code class='inline'>collect</code>, <code class='inline'>forEach</code>, <code class='inline'>reduce</code>, <code class='inline'>count</code>.</li><li>Use <code class='inline'>parallelStream()</code> only for large, CPU-bound, stateless work.</li></ul><p><b>Caution:</b> streams are less readable for complex side effects and can be slower for tiny collections — a plain loop is fine there.</p>",
  answerHi: "<p>Streams collections को <b>functional तरीके</b> से process करते हैं — filter, map, reduce — बिना manual loop लिखे।</p><ul><li><b>Intermediate ops</b> (lazy): <code class='inline'>filter</code>, <code class='inline'>map</code>, <code class='inline'>sorted</code>।</li><li><b>Terminal ops</b> (execution शुरू): <code class='inline'>collect</code>, <code class='inline'>forEach</code>, <code class='inline'>reduce</code>।</li><li><code class='inline'>parallelStream()</code> सिर्फ़ बड़े, CPU-heavy, stateless काम के लिए।</li></ul><p><b>ध्यान:</b> complex side-effects में streams कम readable होते हैं और छोटी collections में slow — वहाँ simple loop ठीक है।</p>",
  code: "List<String> names = users.stream()\n    .filter(u -> u.isActive())\n    .map(User::getName)\n    .sorted()\n    .collect(Collectors.toList());"
},
{
  id: "java-6", category: "Java Core", difficulty: "hard",
  question: "Explain JVM memory model: heap, stack, and garbage collection.",
  answerEn: "<ul><li><b>Stack</b> — per-thread; holds method frames, local variables, references. Freed automatically when a method returns.</li><li><b>Heap</b> — shared; holds all objects. Divided into <b>Young Gen</b> (Eden + Survivor) and <b>Old Gen</b>.</li><li><b>GC:</b> new objects go to Eden. Minor GC clears short-lived objects; survivors are promoted to Old Gen. Major/Full GC cleans Old Gen (more expensive).</li><li><b>G1 GC</b> (default since Java 9) splits the heap into regions and targets predictable pause times.</li></ul><p><b>Memory leaks</b> in Java happen via lingering references (static collections, unclosed resources, listeners) — GC can't collect what's still reachable.</p>",
  answerHi: "<ul><li><b>Stack</b> — हर thread का अलग; method frames, local variables, references रखता है। Method खत्म होते ही free।</li><li><b>Heap</b> — shared; सारे objects यहाँ। <b>Young Gen</b> (Eden + Survivor) और <b>Old Gen</b> में बँटा है।</li><li><b>GC:</b> नए objects Eden में जाते हैं। Minor GC छोटी उम्र वाले objects हटाता है; बचे हुए Old Gen में promote होते हैं। Full GC Old Gen साफ़ करता है (महँगा)।</li><li><b>G1 GC</b> (Java 9+ default) heap को regions में बाँटकर predictable pause देता है।</li></ul><p><b>Memory leak</b> Java में तब होता है जब reference बचा रहे (static collections, unclosed resources) — जो reachable है उसे GC हटा नहीं सकता।</p>"
},
{
  id: "java-7", category: "Java Core", difficulty: "medium",
  question: "final vs finally vs finalize — and String vs StringBuilder?",
  answerEn: "<ul><li><b>final</b> — keyword: a final variable can't be reassigned, a final method can't be overridden, a final class can't be extended.</li><li><b>finally</b> — a block that always runs after try/catch (used to close resources).</li><li><b>finalize()</b> — a deprecated Object method called before GC; don't rely on it.</li></ul><p><b>String vs StringBuilder:</b> <code class='inline'>String</code> is immutable — every concatenation creates a new object. <code class='inline'>StringBuilder</code> is mutable and efficient for loops. <code class='inline'>StringBuffer</code> is the thread-safe (synchronized) version.</p>",
  answerHi: "<ul><li><b>final</b> — keyword: final variable दोबारा assign नहीं, final method override नहीं, final class extend नहीं।</li><li><b>finally</b> — block जो try/catch के बाद हमेशा चलता है (resources close करने के लिए)।</li><li><b>finalize()</b> — deprecated method जो GC से पहले चलता था; इस पर भरोसा मत करो।</li></ul><p><b>String vs StringBuilder:</b> <code class='inline'>String</code> immutable है — हर बार जोड़ने पर नया object बनता है। <code class='inline'>StringBuilder</code> mutable है, loops में efficient। <code class='inline'>StringBuffer</code> इसका thread-safe version है।</p>"
},

/* ============================ SPRING BOOT ============================ */
{
  id: "spring-1", category: "Spring Boot", difficulty: "easy",
  question: "What is Dependency Injection and IoC in Spring?",
  answerEn: "<p><b>Inversion of Control (IoC):</b> instead of a class creating its own dependencies, the Spring <b>container</b> creates and supplies them. Control is 'inverted' to the framework.</p><p><b>Dependency Injection (DI)</b> is how IoC is implemented — Spring injects beans via <b>constructor</b> (preferred), setter, or field.</p><p><b>Benefits:</b> loose coupling, easy testing (inject mocks), and single responsibility. Constructor injection is preferred because it makes dependencies explicit and supports immutability.</p>",
  answerHi: "<p><b>IoC (Inversion of Control):</b> class खुद अपनी dependencies बनाने की जगह, Spring <b>container</b> उन्हें बनाकर देता है। Control framework के पास चला जाता है।</p><p><b>DI (Dependency Injection)</b> IoC को implement करने का तरीका है — Spring beans को <b>constructor</b> (best), setter या field से inject करता है।</p><p><b>फायदे:</b> loose coupling, आसान testing (mocks inject कर सकते हैं)। Constructor injection best है क्योंकि dependencies साफ़ दिखती हैं और immutability मिलती है।</p>",
  code: "@Service\npublic class PaymentService {\n    private final GatewayClient client;\n    // constructor injection (no @Autowired needed for single ctor)\n    public PaymentService(GatewayClient client) {\n        this.client = client;\n    }\n}"
},
{
  id: "spring-2", category: "Spring Boot", difficulty: "medium",
  question: "How does Spring Boot auto-configuration work?",
  answerEn: "<p>Spring Boot auto-configures beans based on what's on the <b>classpath</b> and existing beans.</p><ul><li><code class='inline'>@SpringBootApplication</code> bundles <code class='inline'>@EnableAutoConfiguration</code>, <code class='inline'>@ComponentScan</code>, and <code class='inline'>@Configuration</code>.</li><li>Auto-config classes are listed in <code class='inline'>META-INF/spring.factories</code> (or the newer imports file).</li><li>They use <b>@Conditional</b> annotations — e.g. <code class='inline'>@ConditionalOnClass</code>, <code class='inline'>@ConditionalOnMissingBean</code> — so a bean is created only if it makes sense and you haven't defined your own.</li></ul><p>Example: add the JPA starter + an H2 dependency, and Spring auto-configures a DataSource, EntityManager, and transaction manager.</p>",
  answerHi: "<p>Spring Boot beans को <b>classpath</b> पर मौजूद libraries और existing beans के आधार पर अपने-आप configure करता है।</p><ul><li><code class='inline'>@SpringBootApplication</code> के अंदर <code class='inline'>@EnableAutoConfiguration</code>, <code class='inline'>@ComponentScan</code>, <code class='inline'>@Configuration</code> तीनों होते हैं।</li><li>Auto-config classes <code class='inline'>spring.factories</code> में listed होती हैं।</li><li>ये <b>@Conditional</b> annotations use करती हैं — जैसे <code class='inline'>@ConditionalOnClass</code>, <code class='inline'>@ConditionalOnMissingBean</code> — यानी bean तभी बनेगा जब ज़रूरी हो और आपने खुद न बनाया हो।</li></ul><p>जैसे JPA starter + H2 add करते ही Spring DataSource, EntityManager अपने-आप बना देता है।</p>"
},
{
  id: "spring-3", category: "Spring Boot", difficulty: "medium",
  question: "Explain @Transactional — propagation and isolation.",
  answerEn: "<p><code class='inline'>@Transactional</code> wraps a method in a database transaction — commit on success, rollback on a runtime exception.</p><ul><li><b>Propagation</b> — how transactions nest: <code class='inline'>REQUIRED</code> (default, join existing or create), <code class='inline'>REQUIRES_NEW</code> (suspend outer, start fresh), <code class='inline'>NESTED</code>, <code class='inline'>MANDATORY</code>.</li><li><b>Isolation</b> — visibility of uncommitted data: <code class='inline'>READ_COMMITTED</code> (default in most DBs), <code class='inline'>REPEATABLE_READ</code>, <code class='inline'>SERIALIZABLE</code>. Higher isolation = fewer anomalies but less concurrency.</li></ul><p><b>Gotchas:</b> by default it only rolls back on unchecked exceptions (use <code class='inline'>rollbackFor</code> for checked); and it works via proxies, so <b>self-invocation</b> (calling a @Transactional method from the same class) is not intercepted.</p>",
  answerHi: "<p><code class='inline'>@Transactional</code> method को database transaction में लपेटता है — success पर commit, runtime exception पर rollback।</p><ul><li><b>Propagation</b> — transactions कैसे nest हों: <code class='inline'>REQUIRED</code> (default), <code class='inline'>REQUIRES_NEW</code> (नया transaction), <code class='inline'>NESTED</code>, <code class='inline'>MANDATORY</code>।</li><li><b>Isolation</b> — uncommitted data कितना दिखे: <code class='inline'>READ_COMMITTED</code> (ज़्यादातर DB में default), <code class='inline'>REPEATABLE_READ</code>, <code class='inline'>SERIALIZABLE</code>। ज़्यादा isolation = कम anomalies पर कम concurrency।</li></ul><p><b>ध्यान:</b> default में सिर्फ़ unchecked exceptions पर rollback होता है (checked के लिए <code class='inline'>rollbackFor</code>); और ये proxy से काम करता है इसलिए <b>same class के अंदर</b> से call करने पर intercept नहीं होता।</p>"
},
{
  id: "spring-4", category: "Spring Boot", difficulty: "medium",
  question: "Bean scopes and bean lifecycle in Spring?",
  answerEn: "<p><b>Scopes:</b> <code class='inline'>singleton</code> (default, one per container), <code class='inline'>prototype</code> (new each request), and web scopes <code class='inline'>request</code>, <code class='inline'>session</code>, <code class='inline'>application</code>.</p><p><b>Lifecycle:</b> instantiate → populate dependencies → <code class='inline'>@PostConstruct</code> / <code class='inline'>InitializingBean</code> → bean is ready and in use → <code class='inline'>@PreDestroy</code> / <code class='inline'>DisposableBean</code> on shutdown.</p><p>Note: singleton beans holding mutable state are a common bug source in concurrent apps — keep them stateless.</p>",
  answerHi: "<p><b>Scopes:</b> <code class='inline'>singleton</code> (default, container में एक), <code class='inline'>prototype</code> (हर बार नया), और web scopes <code class='inline'>request</code>, <code class='inline'>session</code>, <code class='inline'>application</code>।</p><p><b>Lifecycle:</b> object बनना → dependencies भरना → <code class='inline'>@PostConstruct</code> → bean ready और use में → shutdown पर <code class='inline'>@PreDestroy</code>।</p><p>ध्यान: singleton bean में mutable state रखना concurrent apps में common bug है — इन्हें stateless रखो।</p>"
},
{
  id: "spring-5", category: "Spring Boot", difficulty: "medium",
  question: "How do you handle exceptions globally in a Spring Boot REST API?",
  answerEn: "<p>Use a centralized handler with <code class='inline'>@RestControllerAdvice</code> and <code class='inline'>@ExceptionHandler</code> methods. This keeps controllers clean and returns consistent error responses (status code + body).</p><ul><li>Map domain exceptions to proper HTTP codes (404 not found, 400 validation, 409 conflict).</li><li>Combine with bean validation (<code class='inline'>@Valid</code>) to catch <code class='inline'>MethodArgumentNotValidException</code>.</li><li>Return a structured error object (timestamp, message, path) — never leak stack traces to clients.</li></ul>",
  answerHi: "<p>एक central handler बनाओ — <code class='inline'>@RestControllerAdvice</code> + <code class='inline'>@ExceptionHandler</code> methods से। इससे controllers साफ़ रहते हैं और सभी errors का response एक जैसा (status + body) मिलता है।</p><ul><li>Domain exceptions को सही HTTP code से map करो (404, 400, 409)।</li><li><code class='inline'>@Valid</code> validation के साथ जोड़ो ताकि <code class='inline'>MethodArgumentNotValidException</code> पकड़ में आए।</li><li>Structured error object लौटाओ (timestamp, message, path) — client को कभी stack trace मत दिखाओ।</li></ul>",
  code: "@RestControllerAdvice\npublic class ApiExceptionHandler {\n    @ExceptionHandler(ResourceNotFoundException.class)\n    public ResponseEntity<ApiError> handle(ResourceNotFoundException ex) {\n        return ResponseEntity.status(HttpStatus.NOT_FOUND)\n            .body(new ApiError(ex.getMessage()));\n    }\n}"
},
{
  id: "spring-6", category: "Spring Boot", difficulty: "hard",
  question: "What is the N+1 query problem in Hibernate and how do you fix it?",
  answerEn: "<p>The <b>N+1 problem</b>: you fetch N parent rows with 1 query, then Hibernate fires 1 extra query per parent to load its lazy association — N+1 total queries. It silently kills performance.</p><p><b>Fixes:</b></p><ul><li><b>JOIN FETCH</b> in JPQL to load parents + children in one query.</li><li><b>@EntityGraph</b> to declaratively fetch associations.</li><li><b>Batch fetching</b> (<code class='inline'>@BatchSize</code>) to load children in groups instead of one-by-one.</li><li>Use <b>DTO projections</b> when you only need a few fields.</li></ul>",
  answerHi: "<p><b>N+1 problem:</b> आप 1 query से N parent rows लाते हैं, फिर Hibernate हर parent के lazy association के लिए 1-1 extra query चलाता है — कुल N+1 queries। ये चुपचाप performance खा जाता है।</p><p><b>Fix:</b></p><ul><li>JPQL में <b>JOIN FETCH</b> — parent + children एक ही query में।</li><li><b>@EntityGraph</b> से associations fetch करना।</li><li><b>@BatchSize</b> से children groups में लाना।</li><li>सिर्फ़ कुछ fields चाहिए तो <b>DTO projection</b> use करो।</li></ul>",
  code: "@Query(\"SELECT o FROM Order o JOIN FETCH o.items WHERE o.userId = :id\")\nList<Order> findWithItems(@Param(\"id\") Long id);"
},
{
  id: "spring-7", category: "Spring Boot", difficulty: "medium",
  question: "How do you secure a REST API with JWT?",
  answerEn: "<p>JWT (JSON Web Token) enables <b>stateless</b> authentication — no server-side session.</p><ul><li>On login, verify credentials and issue a signed JWT (header.payload.signature) with claims (userId, roles, expiry).</li><li>Client sends it in <code class='inline'>Authorization: Bearer &lt;token&gt;</code> on each request.</li><li>A Spring Security filter validates the signature and expiry, then sets the <code class='inline'>SecurityContext</code>.</li><li>Use short-lived access tokens + refresh tokens; sign with a strong secret or RSA key; never store sensitive data in the payload (it's only base64, not encrypted).</li></ul>",
  answerHi: "<p>JWT से <b>stateless</b> authentication होती है — server पर session रखने की ज़रूरत नहीं।</p><ul><li>Login पर credentials verify करके एक signed JWT देते हैं जिसमें claims होती हैं (userId, roles, expiry)।</li><li>Client हर request में <code class='inline'>Authorization: Bearer &lt;token&gt;</code> भेजता है।</li><li>Spring Security filter signature और expiry check करके <code class='inline'>SecurityContext</code> set करता है।</li><li>Short access token + refresh token रखो; strong secret/RSA से sign करो; payload में sensitive data मत रखो (ये सिर्फ़ base64 है, encrypted नहीं)।</li></ul>"
},

/* ============================ MICROSERVICES ============================ */
{
  id: "micro-1", category: "Microservices", difficulty: "medium",
  question: "Monolith vs Microservices — trade-offs?",
  answerEn: "<p><b>Monolith:</b> one deployable. Simpler to build, test, and deploy early on; but scaling, releasing, and team autonomy get hard as it grows.</p><p><b>Microservices:</b> independently deployable services, each owning its data.</p><ul><li><b>Pros:</b> independent scaling & deployment, tech freedom per service, fault isolation, team ownership.</li><li><b>Cons:</b> distributed-system complexity — network latency, eventual consistency, harder debugging/tracing, ops overhead.</li></ul><p><b>Rule of thumb:</b> start monolith, split into microservices when clear domain boundaries and scaling pain appear. Don't adopt microservices for a small team/product.</p>",
  answerHi: "<p><b>Monolith:</b> एक ही deployable app। शुरू में बनाना, test, deploy आसान; पर बड़ा होने पर scaling और release मुश्किल।</p><p><b>Microservices:</b> अलग-अलग deploy होने वाली services, हर एक का अपना data।</p><ul><li><b>फायदे:</b> independent scaling/deployment, हर service की अपनी tech, fault isolation, team ownership।</li><li><b>नुकसान:</b> distributed system की complexity — network latency, eventual consistency, debugging मुश्किल, ops overhead।</li></ul><p><b>नियम:</b> monolith से शुरू करो, domain boundaries और scaling की दिक्कत आने पर microservices में बाँटो। छोटे product/team के लिए microservices ज़रूरी नहीं।</p>"
},
{
  id: "micro-2", category: "Microservices", difficulty: "hard",
  question: "How do you keep data consistent across microservices? (Saga pattern)",
  answerEn: "<p>You can't use one distributed ACID transaction across services. Instead use the <b>Saga pattern</b> — a sequence of local transactions, each publishing an event that triggers the next step; if a step fails, run <b>compensating transactions</b> to undo prior steps.</p><ul><li><b>Choreography:</b> services react to each other's events (no central coordinator) — simple but harder to trace.</li><li><b>Orchestration:</b> a central orchestrator tells each service what to do — easier to reason about and monitor.</li></ul><p>Combine with <b>idempotency</b> (safe retries) and the <b>outbox pattern</b> (atomically save state + event) — critical in payments to avoid double charges.</p>",
  answerHi: "<p>Services के बीच एक distributed ACID transaction नहीं हो सकता। इसकी जगह <b>Saga pattern</b> use करते हैं — कई local transactions की एक chain, हर step event publish करके अगले को trigger करता है; कोई step fail हो तो <b>compensating transaction</b> से पिछले steps undo करते हैं।</p><ul><li><b>Choreography:</b> services एक-दूसरे के events पर react करती हैं (कोई central coordinator नहीं) — simple पर trace करना मुश्किल।</li><li><b>Orchestration:</b> एक central orchestrator हर service को बताता है क्या करना है — monitor करना आसान।</li></ul><p>इसे <b>idempotency</b> (safe retries) और <b>outbox pattern</b> के साथ जोड़ो — payments में double charge रोकने के लिए ज़रूरी।</p>"
},
{
  id: "micro-3", category: "Microservices", difficulty: "medium",
  question: "What is a Circuit Breaker and why use it?",
  answerEn: "<p>A <b>circuit breaker</b> (e.g. Resilience4j) prevents cascading failures. If a downstream service keeps failing, the breaker <b>opens</b> and fails fast (returns a fallback) instead of piling up blocked threads.</p><ul><li><b>Closed</b> — calls pass through normally.</li><li><b>Open</b> — after a failure threshold, calls short-circuit immediately.</li><li><b>Half-open</b> — after a wait, a few trial calls test if the service recovered.</li></ul><p>Pair with <b>timeouts</b>, <b>retries</b> (with backoff), and <b>bulkheads</b> to isolate failures.</p>",
  answerHi: "<p><b>Circuit breaker</b> (जैसे Resilience4j) cascading failures रोकता है। अगर कोई downstream service बार-बार fail हो रही है तो breaker <b>open</b> होकर तुरंत fail (fallback देकर) कर देता है, threads block नहीं होते।</p><ul><li><b>Closed</b> — calls normal चलती हैं।</li><li><b>Open</b> — failure threshold के बाद calls तुरंत fail।</li><li><b>Half-open</b> — कुछ देर बाद थोड़ी calls चलाकर देखते हैं service ठीक हुई या नहीं।</li></ul><p>इसके साथ <b>timeouts</b>, <b>retries</b> (backoff के साथ) और <b>bulkhead</b> भी use करो।</p>"
},
{
  id: "micro-4", category: "Microservices", difficulty: "medium",
  question: "Sync (REST) vs Async (messaging) communication — when to use which?",
  answerEn: "<p><b>Synchronous (REST/gRPC):</b> caller waits for a response. Use when you need an immediate result (e.g. validate a payment). Downside: tight coupling — if the callee is down/slow, the caller suffers.</p><p><b>Asynchronous (RabbitMQ/Kafka):</b> caller publishes a message and moves on. Use for decoupling, load leveling, and events that don't need an instant reply (email, notifications, order processing). Gives resilience and buffering but adds eventual consistency.</p><p><b>Common design:</b> sync for the request path, async (events) for side-effects.</p>",
  answerHi: "<p><b>Synchronous (REST/gRPC):</b> caller response का इंतज़ार करता है। जब तुरंत result चाहिए तब use करो (जैसे payment validate)। नुकसान: tight coupling — callee down/slow हो तो caller भी अटकता है।</p><p><b>Asynchronous (RabbitMQ/Kafka):</b> caller message डालकर आगे बढ़ जाता है। Decoupling, load leveling और ऐसे events के लिए जहाँ तुरंत reply ज़रूरी नहीं (email, notification, order processing)। Resilience मिलती है पर eventual consistency आती है।</p><p><b>आम design:</b> request path के लिए sync, side-effects के लिए async events।</p>"
},
{
  id: "micro-5", category: "Microservices", difficulty: "medium",
  question: "How do you handle service discovery, config, and an API gateway?",
  answerEn: "<ul><li><b>API Gateway</b> (e.g. Spring Cloud Gateway) — single entry point handling routing, auth, rate limiting, and SSL termination, so clients don't call services directly.</li><li><b>Service Discovery</b> (Eureka/Consul or Kubernetes DNS) — services register themselves; callers look them up by name instead of hardcoding IPs (which change as instances scale).</li><li><b>Config Server</b> — centralized, environment-specific config so you don't rebuild to change a value; supports refresh without redeploy.</li></ul>",
  answerHi: "<ul><li><b>API Gateway</b> (जैसे Spring Cloud Gateway) — single entry point जो routing, auth, rate limiting, SSL संभालता है, ताकि clients सीधे services को call न करें।</li><li><b>Service Discovery</b> (Eureka/Consul या Kubernetes DNS) — services खुद को register करती हैं; caller उन्हें name से ढूँढता है, hardcoded IP नहीं (instances scale होने पर IP बदलती है)।</li><li><b>Config Server</b> — centralized environment-wise config, ताकि value बदलने के लिए दोबारा build न करना पड़े।</li></ul>"
},
{
  id: "micro-6", category: "Microservices", difficulty: "hard",
  question: "What is idempotency and why is it critical for payments?",
  answerEn: "<p>An <b>idempotent</b> operation produces the same result whether it runs once or many times. In distributed systems, retries and duplicate messages are inevitable — without idempotency you could <b>charge a card twice</b>.</p><p><b>How to implement:</b></p><ul><li>Client sends a unique <b>idempotency key</b> per request.</li><li>Server stores processed keys; a repeat key returns the original result instead of re-processing.</li><li>Make message consumers idempotent (check if the event was already applied).</li></ul><p>This is exactly why payment APIs (Stripe, and your Bancstac work) require idempotency keys.</p>",
  answerHi: "<p><b>Idempotent</b> operation एक बार चले या कई बार, result वही रहता है। Distributed systems में retries और duplicate messages होना तय है — idempotency न हो तो <b>card दो बार charge</b> हो सकता है।</p><p><b>कैसे करें:</b></p><ul><li>Client हर request के लिए unique <b>idempotency key</b> भेजे।</li><li>Server processed keys store करे; वही key दोबारा आए तो original result लौटाए, दोबारा process न करे।</li><li>Message consumers को idempotent बनाओ (check करो event पहले apply हुआ या नहीं)।</li></ul><p>इसीलिए payment APIs (Stripe, आपका Bancstac) idempotency key माँगते हैं।</p>"
},

/* ============================ RABBITMQ ============================ */
{
  id: "rmq-1", category: "RabbitMQ & Messaging", difficulty: "medium",
  question: "Explain RabbitMQ core concepts: exchange, queue, binding, routing key.",
  answerEn: "<p>RabbitMQ decouples producers from consumers:</p><ul><li><b>Producer</b> publishes a message to an <b>Exchange</b> (not directly to a queue).</li><li><b>Exchange</b> routes it to <b>Queues</b> based on the <b>routing key</b> and <b>bindings</b>.</li><li><b>Queue</b> buffers messages until a <b>Consumer</b> acknowledges them.</li></ul><p><b>Exchange types:</b> <code class='inline'>direct</code> (exact routing-key match), <code class='inline'>topic</code> (wildcard patterns like <code class='inline'>order.*</code>), <code class='inline'>fanout</code> (broadcast to all bound queues), <code class='inline'>headers</code>.</p>",
  answerHi: "<p>RabbitMQ producer और consumer को अलग करता है:</p><ul><li><b>Producer</b> message को <b>Exchange</b> पर भेजता है (सीधे queue पर नहीं)।</li><li><b>Exchange</b> उसे <b>routing key</b> और <b>bindings</b> के हिसाब से <b>Queues</b> तक पहुँचाता है।</li><li><b>Queue</b> messages को तब तक रखता है जब तक <b>Consumer</b> acknowledge न कर दे।</li></ul><p><b>Exchange types:</b> <code class='inline'>direct</code> (exact match), <code class='inline'>topic</code> (wildcard जैसे <code class='inline'>order.*</code>), <code class='inline'>fanout</code> (सबको broadcast), <code class='inline'>headers</code>।</p>"
},
{
  id: "rmq-2", category: "RabbitMQ & Messaging", difficulty: "medium",
  question: "How do you guarantee message delivery and handle failures in RabbitMQ?",
  answerEn: "<ul><li><b>Acknowledgements:</b> consumer sends <code class='inline'>ack</code> only after successful processing; if it crashes, the unacked message is redelivered (at-least-once delivery).</li><li><b>Publisher confirms:</b> broker confirms it persisted the message.</li><li><b>Durable queues + persistent messages</b> survive broker restarts.</li><li><b>Dead Letter Queue (DLQ):</b> messages that fail repeatedly (or are rejected/expired) are routed to a DLQ for inspection instead of being lost or retried forever.</li><li>Because delivery is at-least-once, make consumers <b>idempotent</b>.</li></ul>",
  answerHi: "<ul><li><b>Acknowledgement:</b> consumer successful processing के बाद ही <code class='inline'>ack</code> भेजे; crash हो जाए तो unacked message दोबारा deliver होता है (at-least-once)।</li><li><b>Publisher confirms:</b> broker confirm करता है कि message save हो गया।</li><li><b>Durable queue + persistent messages</b> broker restart पर भी बचे रहते हैं।</li><li><b>Dead Letter Queue (DLQ):</b> बार-बार fail होने वाले messages DLQ में जाते हैं, ताकि खोएँ नहीं और हमेशा retry भी न हों।</li><li>Delivery at-least-once है, इसलिए consumers को <b>idempotent</b> बनाओ।</li></ul>"
},
{
  id: "rmq-3", category: "RabbitMQ & Messaging", difficulty: "medium",
  question: "RabbitMQ vs Kafka — when would you choose each?",
  answerEn: "<p><b>RabbitMQ</b> — a traditional message broker (smart broker, dumb consumer). Great for <b>task queues</b>, complex routing, request/reply, and per-message acknowledgement. Messages are removed once consumed.</p><p><b>Kafka</b> — a distributed <b>log</b>. Great for high-throughput event streaming, replaying events, and multiple consumer groups reading the same stream. Messages are retained for a configured period.</p><p><b>Choose RabbitMQ</b> for command/task distribution and routing flexibility; <b>choose Kafka</b> for event sourcing, analytics pipelines, and massive throughput.</p>",
  answerHi: "<p><b>RabbitMQ</b> — traditional message broker। <b>Task queues</b>, complex routing, request/reply और per-message ack के लिए बढ़िया। Message consume होते ही हट जाता है।</p><p><b>Kafka</b> — distributed <b>log</b>। High-throughput event streaming, events को replay करने और कई consumer groups के लिए बढ़िया। Messages कुछ समय तक store रहते हैं।</p><p><b>RabbitMQ चुनो</b> task distribution और routing के लिए; <b>Kafka चुनो</b> event sourcing, analytics और बहुत बड़े throughput के लिए।</p>"
},

/* ============================ DATABASES ============================ */
{
  id: "db-1", category: "Databases & SQL", difficulty: "medium",
  question: "What are database indexes and what are their trade-offs?",
  answerEn: "<p>An <b>index</b> is a data structure (usually a B-tree) that lets the DB find rows without scanning the whole table — like a book's index.</p><ul><li><b>Speeds up</b> reads on <code class='inline'>WHERE</code>, <code class='inline'>JOIN</code>, <code class='inline'>ORDER BY</code> columns.</li><li><b>Costs:</b> extra storage and slower writes (every insert/update must maintain the index).</li><li><b>Composite index</b> order matters — it helps queries that filter on a <b>left-most prefix</b> of the columns.</li></ul><p>Use <code class='inline'>EXPLAIN</code> to verify a query actually uses your index.</p>",
  answerHi: "<p><b>Index</b> एक data structure (आमतौर पर B-tree) है जो DB को पूरी table scan किए बिना rows ढूँढने देता है — किताब के index की तरह।</p><ul><li><code class='inline'>WHERE</code>, <code class='inline'>JOIN</code>, <code class='inline'>ORDER BY</code> वाले columns पर reads <b>तेज़</b> करता है।</li><li><b>कीमत:</b> extra storage और writes slow (हर insert/update पर index update होता है)।</li><li><b>Composite index</b> में column order मायने रखता है — ये <b>left-most prefix</b> वाली queries में मदद करता है।</li></ul><p><code class='inline'>EXPLAIN</code> से check करो कि query सच में index use कर रही है या नहीं।</p>"
},
{
  id: "db-2", category: "Databases & SQL", difficulty: "medium",
  question: "Explain ACID properties and transaction isolation levels.",
  answerEn: "<p><b>ACID:</b></p><ul><li><b>Atomicity</b> — all steps commit or none do.</li><li><b>Consistency</b> — the DB moves from one valid state to another.</li><li><b>Isolation</b> — concurrent transactions don't corrupt each other.</li><li><b>Durability</b> — committed data survives crashes.</li></ul><p><b>Isolation levels</b> (weak → strong) trade concurrency for correctness: <code class='inline'>READ UNCOMMITTED</code> (dirty reads), <code class='inline'>READ COMMITTED</code>, <code class='inline'>REPEATABLE READ</code> (prevents non-repeatable reads), <code class='inline'>SERIALIZABLE</code> (full isolation, prevents phantom reads).</p>",
  answerHi: "<p><b>ACID:</b></p><ul><li><b>Atomicity</b> — या तो सारे steps commit हों या कोई नहीं।</li><li><b>Consistency</b> — DB एक valid state से दूसरे valid state में जाए।</li><li><b>Isolation</b> — एक साथ चलने वाले transactions एक-दूसरे को corrupt न करें।</li><li><b>Durability</b> — commit हुआ data crash में भी बचे।</li></ul><p><b>Isolation levels</b> (weak → strong): <code class='inline'>READ UNCOMMITTED</code> (dirty read), <code class='inline'>READ COMMITTED</code>, <code class='inline'>REPEATABLE READ</code>, <code class='inline'>SERIALIZABLE</code> (पूरा isolation)। जितना strong उतना correct पर कम concurrency।</p>"
},
{
  id: "db-3", category: "Databases & SQL", difficulty: "medium",
  question: "SQL vs NoSQL — how do you decide?",
  answerEn: "<p><b>SQL (MySQL/PostgreSQL):</b> structured schema, strong consistency, ACID transactions, powerful joins. Best for financial/transactional data where correctness matters (your payments work).</p><p><b>NoSQL (MongoDB/Redis/Elasticsearch):</b> flexible schema, horizontal scale, high throughput.</p><ul><li><b>Document (Mongo)</b> — flexible/evolving data.</li><li><b>Key-value (Redis)</b> — caching, sessions.</li><li><b>Search (Elasticsearch)</b> — full-text search, log analytics.</li></ul><p>Real systems are <b>polyglot</b> — MySQL for orders, Redis for cache, Elasticsearch for search (as in your resume).</p>",
  answerHi: "<p><b>SQL (MySQL/PostgreSQL):</b> fixed schema, strong consistency, ACID transactions, powerful joins। Financial/transactional data के लिए best जहाँ correctness ज़रूरी है (आपका payments काम)।</p><p><b>NoSQL (MongoDB/Redis/Elasticsearch):</b> flexible schema, horizontal scale, high throughput।</p><ul><li><b>Document (Mongo)</b> — बदलता हुआ data।</li><li><b>Key-value (Redis)</b> — caching, sessions।</li><li><b>Search (Elasticsearch)</b> — full-text search, logs।</li></ul><p>असली systems <b>polyglot</b> होते हैं — orders के लिए MySQL, cache के लिए Redis, search के लिए Elasticsearch।</p>"
},
{
  id: "db-4", category: "Databases & SQL", difficulty: "easy",
  question: "Explain the different types of SQL JOINs.",
  answerEn: "<ul><li><b>INNER JOIN</b> — only rows matching in both tables.</li><li><b>LEFT JOIN</b> — all rows from the left table + matches from the right (NULLs where no match).</li><li><b>RIGHT JOIN</b> — all rows from the right + matches from the left.</li><li><b>FULL OUTER JOIN</b> — all rows from both, matched where possible.</li><li><b>CROSS JOIN</b> — Cartesian product (every combination).</li></ul>",
  answerHi: "<ul><li><b>INNER JOIN</b> — सिर्फ़ वो rows जो दोनों tables में match करें।</li><li><b>LEFT JOIN</b> — left table की सारी rows + right के matches (match न हो तो NULL)।</li><li><b>RIGHT JOIN</b> — right की सारी rows + left के matches।</li><li><b>FULL OUTER JOIN</b> — दोनों tables की सारी rows।</li><li><b>CROSS JOIN</b> — हर combination (Cartesian product)।</li></ul>",
  code: "SELECT o.id, u.name\nFROM orders o\nLEFT JOIN users u ON o.user_id = u.id;"
},

/* ============================ REACT ============================ */
{
  id: "react-1", category: "React & TypeScript", difficulty: "medium",
  question: "Explain useEffect — dependencies, cleanup, and common mistakes.",
  answerEn: "<p><code class='inline'>useEffect</code> runs side effects (data fetching, subscriptions, timers) after render.</p><ul><li><b>Dependency array</b> controls when it re-runs: <code class='inline'>[]</code> = once on mount; <code class='inline'>[a, b]</code> = when a or b changes; omitted = every render.</li><li><b>Cleanup function</b> (the returned function) runs before the next effect and on unmount — use it to clear timers/subscriptions to avoid leaks.</li></ul><p><b>Common mistakes:</b> missing dependencies (stale values), causing infinite loops by setting state without proper deps, and forgetting cleanup.</p>",
  answerHi: "<p><code class='inline'>useEffect</code> render के बाद side effects चलाता है (data fetch, subscription, timer)।</p><ul><li><b>Dependency array</b> तय करती है कब दोबारा चले: <code class='inline'>[]</code> = सिर्फ़ mount पर; <code class='inline'>[a,b]</code> = a या b बदलने पर; न दें तो हर render पर।</li><li><b>Cleanup function</b> (return की गई function) अगले effect से पहले और unmount पर चलती है — timers/subscriptions clear करने के लिए, leaks रोकने के लिए।</li></ul><p><b>आम गलतियाँ:</b> dependency छूट जाना (stale value), गलत deps से infinite loop, cleanup भूल जाना।</p>",
  code: "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id); // cleanup\n}, []);"
},
{
  id: "react-2", category: "React & TypeScript", difficulty: "medium",
  question: "What causes unnecessary re-renders and how do you optimize?",
  answerEn: "<p>A component re-renders when its <b>state/props change</b> or its <b>parent re-renders</b>. Excess re-renders hurt performance.</p><ul><li><b>React.memo</b> — skips re-render if props are unchanged (shallow compare).</li><li><b>useMemo</b> — memoizes an expensive computed value.</li><li><b>useCallback</b> — memoizes a function so child props stay stable.</li><li>Give lists stable <b>keys</b> (not array index for dynamic lists).</li><li>Don't create new objects/arrays inline in props unnecessarily.</li></ul><p><b>Caution:</b> don't over-optimize — memoization has its own cost; profile first.</p>",
  answerHi: "<p>Component तब re-render होता है जब उसका <b>state/props बदले</b> या <b>parent re-render</b> हो। ज़्यादा re-render performance खराब करते हैं।</p><ul><li><b>React.memo</b> — props न बदलें तो re-render skip।</li><li><b>useMemo</b> — महँगी calculation memoize करता है।</li><li><b>useCallback</b> — function memoize करता है ताकि child के props stable रहें।</li><li>Lists को stable <b>key</b> दो (dynamic list में array index मत use करो)।</li></ul><p><b>ध्यान:</b> ज़रूरत से ज़्यादा optimize मत करो — memoization की भी cost है; पहले profile करो।</p>"
},
{
  id: "react-3", category: "React & TypeScript", difficulty: "medium",
  question: "What is React Remix and how do loaders/actions work?",
  answerEn: "<p><b>Remix</b> is a full-stack React framework focused on web fundamentals and SSR.</p><ul><li><b>Loaders</b> — server functions that fetch data <b>before</b> a route renders; the component reads it via <code class='inline'>useLoaderData()</code>. This avoids client-side loading spinners and waterfalls.</li><li><b>Actions</b> — server functions that handle form submissions (POST/PUT/DELETE); Remix uses native <code class='inline'>&lt;Form&gt;</code> so it works even without JS (progressive enhancement).</li><li>Nested routes let each layout segment load its own data in parallel.</li></ul><p>Result: fast, SEO-friendly pages with less client state management.</p>",
  answerHi: "<p><b>Remix</b> एक full-stack React framework है जो web fundamentals और SSR पर focus करता है।</p><ul><li><b>Loaders</b> — server functions जो route render होने से <b>पहले</b> data ले आती हैं; component <code class='inline'>useLoaderData()</code> से पढ़ता है। इससे loading spinners और waterfalls कम होते हैं।</li><li><b>Actions</b> — server functions जो form submit (POST/PUT/DELETE) संभालती हैं; Remix native <code class='inline'>&lt;Form&gt;</code> use करता है इसलिए JS के बिना भी चलता है।</li><li>Nested routes में हर layout अपना data parallel में load करता है।</li></ul><p>नतीजा: तेज़, SEO-friendly pages और कम client state।</p>"
},
{
  id: "react-4", category: "React & TypeScript", difficulty: "easy",
  question: "TypeScript: interface vs type, and why use generics?",
  answerEn: "<p><b>interface vs type:</b> both describe object shapes. <code class='inline'>interface</code> can be re-opened/merged and extended — good for public object contracts. <code class='inline'>type</code> is more flexible — unions, intersections, primitives, tuples.</p><p><b>Generics</b> let you write reusable, type-safe code that works over many types without losing type information.</p>",
  answerHi: "<p><b>interface vs type:</b> दोनों object की shape बताते हैं। <code class='inline'>interface</code> दोबारा extend/merge हो सकता है — public contracts के लिए अच्छा। <code class='inline'>type</code> ज़्यादा flexible है — unions, intersections, primitives, tuples।</p><p><b>Generics</b> से reusable, type-safe code लिखते हैं जो कई types पर चले और type info भी न खोए।</p>",
  code: "function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst n = first<number>([1, 2, 3]); // n: number | undefined"
},

/* ============================ SYSTEM DESIGN ============================ */
{
  id: "sd-1", category: "System Design", difficulty: "hard",
  question: "Design a payment gateway — how would you approach it?",
  answerEn: "<p>Structure the answer: requirements → API → data → flow → scale.</p><ul><li><b>Requirements:</b> accept payments across card networks, high availability, idempotency, PCI DSS, 3DS auth, audit trail.</li><li><b>Flow:</b> API gateway → payment service creates a transaction (status PENDING) → calls the card network/acquirer → 3DS challenge if needed → update status → publish an event.</li><li><b>Reliability:</b> idempotency keys to avoid double charges, outbox pattern for atomic event publishing, retries with backoff, circuit breakers on external calls.</li><li><b>Data:</b> MySQL for transactions (ACID), Redis for caching/rate limiting, message queue for async settlement/notifications.</li><li><b>Security:</b> never store raw PAN — tokenize; encrypt at rest and in transit; strict access control and audit logs.</li></ul><p>This mirrors your Bancstac experience — lead with that.</p>",
  answerHi: "<p>जवाब का structure: requirements → API → data → flow → scale।</p><ul><li><b>Requirements:</b> कई card networks, high availability, idempotency, PCI DSS, 3DS auth, audit trail।</li><li><b>Flow:</b> API gateway → payment service transaction बनाए (status PENDING) → card network को call → ज़रूरत हो तो 3DS challenge → status update → event publish।</li><li><b>Reliability:</b> double charge रोकने के लिए idempotency keys, atomic event के लिए outbox pattern, backoff के साथ retries, external calls पर circuit breaker।</li><li><b>Data:</b> transactions के लिए MySQL (ACID), caching/rate-limit के लिए Redis, async settlement के लिए queue।</li><li><b>Security:</b> raw card number कभी store न करो — tokenize करो; data encrypt करो; strict access control और audit logs।</li></ul><p>ये आपके Bancstac अनुभव से मेल खाता है — इसी से शुरू करो।</p>"
},
{
  id: "sd-2", category: "System Design", difficulty: "medium",
  question: "How would you design a rate limiter?",
  answerEn: "<p><b>Goal:</b> limit requests per client (e.g. 100/min) to protect services.</p><p><b>Algorithms:</b></p><ul><li><b>Token bucket</b> — tokens refill at a fixed rate; each request consumes one; allows short bursts. Most common.</li><li><b>Sliding window</b> — smoother, more accurate than fixed windows.</li><li><b>Fixed window counter</b> — simple but allows bursts at window edges.</li></ul><p><b>Implementation:</b> store counters in <b>Redis</b> (fast, shared across instances, atomic <code class='inline'>INCR</code> + TTL). Apply at the API gateway. Return HTTP <b>429</b> with a <code class='inline'>Retry-After</code> header when exceeded.</p>",
  answerHi: "<p><b>लक्ष्य:</b> हर client की requests limit करना (जैसे 100/min) ताकि services safe रहें।</p><p><b>Algorithms:</b></p><ul><li><b>Token bucket</b> — tokens fixed rate पर भरते हैं; हर request एक token लेती है; थोड़ा burst allow। सबसे common।</li><li><b>Sliding window</b> — ज़्यादा accurate और smooth।</li><li><b>Fixed window counter</b> — simple पर window के किनारों पर burst हो सकता है।</li></ul><p><b>Implementation:</b> counters <b>Redis</b> में रखो (fast, shared, atomic <code class='inline'>INCR</code> + TTL)। API gateway पर लगाओ। Limit पार होने पर HTTP <b>429</b> + <code class='inline'>Retry-After</code> लौटाओ।</p>"
},
{
  id: "sd-3", category: "System Design", difficulty: "medium",
  question: "Caching strategies and how to handle cache invalidation?",
  answerEn: "<p><b>Patterns:</b></p><ul><li><b>Cache-aside (lazy):</b> app checks cache; on miss, loads from DB and populates cache. Most common.</li><li><b>Write-through:</b> writes go to cache and DB together (consistent, slower writes).</li><li><b>Write-behind:</b> write to cache, async to DB (fast, risk of loss).</li></ul><p><b>Invalidation</b> is the hard part — options: set a <b>TTL</b> (expire after N seconds), <b>evict on write</b> (delete/update the key when data changes), or version keys. Watch for <b>cache stampede</b> (many misses at once) — mitigate with locks or staggered TTLs.</p>",
  answerHi: "<p><b>Patterns:</b></p><ul><li><b>Cache-aside (lazy):</b> app पहले cache देखे; miss पर DB से लाकर cache भरे। सबसे common।</li><li><b>Write-through:</b> write cache और DB दोनों में साथ (consistent, writes slow)।</li><li><b>Write-behind:</b> पहले cache में, फिर async DB में (fast पर loss का risk)।</li></ul><p><b>Invalidation</b> सबसे मुश्किल — options: <b>TTL</b> (कुछ सेकंड बाद expire), <b>write पर evict</b> (data बदलने पर key delete/update), या versioned keys। <b>Cache stampede</b> (एक साथ बहुत miss) से बचने के लिए lock या अलग-अलग TTL।</p>"
},

/* ============================ DSA ============================ */
{
  id: "dsa-1", category: "DSA", difficulty: "easy",
  question: "Explain Big-O notation and give common examples.",
  answerEn: "<p><b>Big-O</b> describes how an algorithm's time/space grows as input size n grows (worst case).</p><ul><li><b>O(1)</b> — constant (HashMap get).</li><li><b>O(log n)</b> — binary search.</li><li><b>O(n)</b> — single loop / linear scan.</li><li><b>O(n log n)</b> — good sorts (merge/quick sort).</li><li><b>O(n²)</b> — nested loops (avoid for large n).</li></ul><p>In interviews, always state the time <b>and</b> space complexity of your solution and whether it can be improved.</p>",
  answerHi: "<p><b>Big-O</b> बताता है कि input n बढ़ने पर algorithm का time/space कितना बढ़ता है (worst case)।</p><ul><li><b>O(1)</b> — constant (HashMap get)।</li><li><b>O(log n)</b> — binary search।</li><li><b>O(n)</b> — एक loop / linear scan।</li><li><b>O(n log n)</b> — अच्छे sorts (merge/quick)।</li><li><b>O(n²)</b> — nested loops (बड़े n के लिए avoid)।</li></ul><p>Interview में हमेशा time <b>और</b> space complexity बताओ और ये भी कि improve हो सकता है या नहीं।</p>"
},
{
  id: "dsa-2", category: "DSA", difficulty: "easy",
  question: "Find if an array has a pair summing to a target (Two Sum).",
  answerEn: "<p><b>Brute force</b> is O(n²) with two nested loops. The optimal approach uses a <b>HashMap</b> in a single pass — O(n) time, O(n) space.</p><p>For each number, check if <code class='inline'>target - num</code> was already seen; if yes, you found the pair; otherwise store the number. This 'complement in a hash set' pattern is one of the most common interview building blocks.</p>",
  answerHi: "<p><b>Brute force</b> O(n²) है (दो nested loops)। Best तरीका <b>HashMap</b> से एक ही pass में — O(n) time, O(n) space।</p><p>हर number के लिए check करो कि <code class='inline'>target - num</code> पहले दिखा या नहीं; अगर हाँ तो pair मिल गया; नहीं तो number store कर दो। ये 'complement in hash set' pattern बहुत common है।</p>",
  code: "int[] twoSum(int[] nums, int target) {\n    Map<Integer,Integer> seen = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int need = target - nums[i];\n        if (seen.containsKey(need)) return new int[]{seen.get(need), i};\n        seen.put(nums[i], i);\n    }\n    return new int[]{-1, -1};\n}"
},
{
  id: "dsa-3", category: "DSA", difficulty: "medium",
  question: "Which DSA patterns should you master for interviews?",
  answerEn: "<p>Most medium problems reduce to a handful of patterns — learn to recognize them:</p><ul><li><b>Two pointers</b> — sorted arrays, pairs, palindromes.</li><li><b>Sliding window</b> — subarray/substring with a constraint.</li><li><b>Hashing</b> — frequency counts, complements, dedup.</li><li><b>Binary search</b> — sorted data, 'search on answer'.</li><li><b>BFS/DFS</b> — trees and graphs.</li><li><b>Dynamic programming</b> — overlapping subproblems (knapsack, LIS).</li><li><b>Heap</b> — top-K, merge K lists.</li></ul><p>Practice ~40–50 problems, 1–2 daily. Recognizing the pattern beats memorizing solutions.</p>",
  answerHi: "<p>ज़्यादातर medium problems कुछ ही patterns पर आधारित होती हैं — इन्हें पहचानना सीखो:</p><ul><li><b>Two pointers</b> — sorted arrays, pairs, palindrome।</li><li><b>Sliding window</b> — constraint वाले subarray/substring।</li><li><b>Hashing</b> — frequency count, complement, dedup।</li><li><b>Binary search</b> — sorted data।</li><li><b>BFS/DFS</b> — trees और graphs।</li><li><b>Dynamic programming</b> — overlapping subproblems।</li><li><b>Heap</b> — top-K, merge K lists।</li></ul><p>रोज़ 1–2 करके ~40–50 problems करो। Solution रटने से बेहतर है pattern पहचानना।</p>"
},

/* ============================ BEHAVIORAL ============================ */
{
  id: "beh-1", category: "Behavioral & Leadership", difficulty: "medium",
  question: "Tell me about yourself. (2-minute pitch)",
  answerEn: "<p>Use <b>Present → Past → Future</b>:</p><ul><li><b>Present:</b> \"I'm a full-stack engineer and Project Lead with 4+ years, currently leading a team of 7 on Tendable, a healthcare quality-inspection platform.\"</li><li><b>Past:</b> \"Before that I spent ~3 years building Java/Spring Boot microservices for Bancstac, a payment platform integrating major card networks with 3DS and PCI DSS — I cut gateway latency ~20%.\"</li><li><b>Future:</b> \"I'm looking for a role where I can combine backend depth with technical leadership on high-scale systems.\"</li></ul><p>Keep it ~90 seconds, tailored to the job. Lead with impact, not a task list.</p>",
  answerHi: "<p><b>Present → Past → Future</b> formula use करो:</p><ul><li><b>Present:</b> \"मैं full-stack engineer और Project Lead हूँ, 4+ साल अनुभव, अभी Tendable पर 7 लोगों की team lead कर रहा हूँ।\"</li><li><b>Past:</b> \"उससे पहले ~3 साल Bancstac payment platform पर Java/Spring Boot microservices बनाए — card networks, 3DS, PCI DSS; gateway latency ~20% घटाई।\"</li><li><b>Future:</b> \"अब ऐसा role चाहता हूँ जहाँ backend की depth और technical leadership दोनों use कर सकूँ।\"</li></ul><p>~90 सेकंड, job के हिसाब से। काम की list नहीं, impact बताओ।</p>"
},
{
  id: "beh-2", category: "Behavioral & Leadership", difficulty: "medium",
  question: "Describe a challenging technical problem you solved. (STAR)",
  answerEn: "<p>Use <b>STAR</b>: Situation, Task, Action, Result.</p><ul><li><b>S:</b> \"Our payment gateway had latency spikes under load, risking timeouts on card transactions.\"</li><li><b>T:</b> \"I owned reducing latency without compromising reliability or PCI compliance.\"</li><li><b>A:</b> \"I profiled the flow, found synchronous calls and N+1 queries, introduced async processing via RabbitMQ, added Redis caching and query tuning, and set up circuit breakers on external calls.\"</li><li><b>R:</b> \"Latency dropped ~20% and the system stayed stable at peak load.\"</li></ul><p>Quantify the result and emphasize <b>your</b> specific actions.</p>",
  answerHi: "<p><b>STAR</b> use करो: Situation, Task, Action, Result।</p><ul><li><b>S:</b> \"हमारे payment gateway में load पर latency spikes आते थे, transactions timeout होने का risk था।\"</li><li><b>T:</b> \"reliability और PCI compliance बनाए रखते हुए latency घटाना मेरी ज़िम्मेदारी थी।\"</li><li><b>A:</b> \"मैंने flow profile किया, synchronous calls और N+1 queries पकड़े, RabbitMQ से async processing लाया, Redis caching और query tuning की, external calls पर circuit breaker लगाया।\"</li><li><b>R:</b> \"Latency ~20% घटी और system peak load पर stable रहा।\"</li></ul><p>Result को numbers में बताओ और <b>अपने</b> actions पर ज़ोर दो।</p>"
},
{
  id: "beh-3", category: "Behavioral & Leadership", difficulty: "medium",
  question: "How do you handle conflict within your team?",
  answerEn: "<p>Show maturity and a process, not just 'I stay calm':</p><ul><li>Listen to both sides <b>1:1</b> first to understand the real concern (often it's not the surface issue).</li><li>Bring it back to <b>shared goals</b> and data/facts rather than opinions.</li><li>For technical disagreements, evaluate trade-offs objectively — sometimes prototype both and let results decide.</li><li>Disagree and commit: once a decision is made, the team aligns.</li></ul><p>Give a real example from leading your team of 7 — e.g. a code-review or architecture disagreement you resolved.</p>",
  answerHi: "<p>सिर्फ़ 'मैं calm रहता हूँ' नहीं — एक process दिखाओ:</p><ul><li>पहले दोनों से <b>अलग-अलग (1:1)</b> बात करके असली दिक्कत समझो।</li><li>बात को opinions की जगह <b>common goals</b> और data/facts पर लाओ।</li><li>Technical disagreement में trade-offs objectively देखो — कभी-कभी दोनों approach prototype करके result से तय करो।</li><li>Disagree and commit: फ़ैसला हो जाए तो पूरी team उसके साथ align हो।</li></ul><p>अपनी 7 लोगों की team से एक real example दो — जैसे कोई code-review या architecture disagreement जो आपने सुलझाया।</p>"
},
{
  id: "beh-4", category: "Behavioral & Leadership", difficulty: "medium",
  question: "How did you handle a production incident or tight deadline?",
  answerEn: "<p><b>For an incident</b> show a calm, systematic approach:</p><ul><li><b>Mitigate first</b> — restore service (rollback, failover, scale) before root-causing.</li><li><b>Communicate</b> — keep stakeholders updated with clear status.</li><li><b>Root cause</b> — investigate logs/metrics/traces after stability.</li><li><b>Prevent</b> — add monitoring, alerts, tests, and a blameless post-mortem.</li></ul><p><b>For a tight deadline:</b> scope ruthlessly (MVP first), communicate risk early, parallelize work across the team, and protect quality on the critical path.</p>",
  answerHi: "<p><b>Incident में</b> calm और systematic रहो:</p><ul><li><b>पहले mitigate करो</b> — service वापस लाओ (rollback, failover, scale), root cause बाद में।</li><li><b>Communicate करो</b> — stakeholders को साफ़ status देते रहो।</li><li><b>Root cause</b> — stability के बाद logs/metrics/traces देखो।</li><li><b>Prevent</b> — monitoring, alerts, tests जोड़ो और blameless post-mortem करो।</li></ul><p><b>Tight deadline में:</b> scope छोटा रखो (MVP पहले), risk जल्दी बताओ, काम team में parallel बाँटो, और critical path पर quality बचाओ।</p>"
},
{
  id: "beh-5", category: "Behavioral & Leadership", difficulty: "easy",
  question: "Why are you leaving / looking for a new role?",
  answerEn: "<p>Stay <b>positive</b> — never bad-mouth your current employer. Frame it as growth:</p><p>\"I've grown a lot at Innostax — from engineer to Project Lead — and I'm grateful for it. I'm now looking for a larger-scale environment where I can deepen my backend and system-design work and take on bigger technical ownership.\"</p><p>Focus on what you're moving <b>toward</b>, not away from.</p>",
  answerHi: "<p><b>Positive</b> रहो — current company की बुराई कभी मत करो। इसे growth की तरह पेश करो:</p><p>\"Innostax में मैंने बहुत सीखा — engineer से Project Lead तक पहुँचा, और आभारी हूँ। अब बड़े scale के environment की तलाश है जहाँ backend और system-design में और गहराई और बड़ी technical ownership मिले।\"</p><p>किससे भाग रहे हो नहीं, किसकी <b>ओर</b> जा रहे हो उस पर focus करो।</p>"
},
{
  id: "beh-6", category: "Behavioral & Leadership", difficulty: "medium",
  question: "How do you use AI tools (Cursor, Claude) in your workflow?",
  answerEn: "<p>Show you use AI as a <b>force multiplier</b>, not a crutch:</p><ul><li><b>Speed:</b> scaffolding boilerplate, writing tests, drafting docs, exploring unfamiliar APIs.</li><li><b>Quality:</b> AI-assisted code review to catch bugs and suggest cleaner approaches before human review.</li><li><b>Judgment:</b> \"I always review and understand generated code — I never merge what I can't explain or verify, especially in payment/security-sensitive code.\"</li></ul><p>Mention building/configuring agents and prompt engineering (from your resume) as a concrete edge.</p>",
  answerHi: "<p>दिखाओ कि AI को <b>force multiplier</b> की तरह use करते हो, crutch की तरह नहीं:</p><ul><li><b>Speed:</b> boilerplate, tests, docs, नई APIs explore करना।</li><li><b>Quality:</b> human review से पहले AI-assisted code review से bugs पकड़ना।</li><li><b>Judgment:</b> \"generated code हमेशा समझकर review करता हूँ — जो explain/verify न कर सकूँ वो merge नहीं करता, खासकर payment/security code में।\"</li></ul><p>Agents बनाना/configure करना और prompt engineering (आपके resume से) एक ठोस edge के तौर पर बताओ।</p>"
},
{
  id: "beh-7", category: "Behavioral & Leadership", difficulty: "medium",
  question: "How do you make the transition from engineer to lead? What changed?",
  answerEn: "<p>Show self-awareness about the shift from <b>individual output</b> to <b>team output</b>:</p><ul><li>Success is now measured by what the <b>team</b> ships, not just my own code.</li><li>I spend more time on <b>unblocking, mentoring, code review, and planning</b>, and I protect focus time for the team.</li><li>I still stay hands-on enough to make sound architectural calls and earn technical credibility.</li><li>The hardest lesson: <b>delegating</b> and trusting the team instead of doing everything myself.</li></ul>",
  answerHi: "<p><b>अपने output</b> से <b>team के output</b> की तरफ़ shift की समझ दिखाओ:</p><ul><li>अब success सिर्फ़ मेरे code से नहीं, <b>team</b> क्या ship करती है उससे मापा जाता है।</li><li>ज़्यादा समय <b>unblocking, mentoring, code review, planning</b> में जाता है और team का focus time बचाता हूँ।</li><li>Architecture के सही फ़ैसले और technical credibility के लिए hands-on भी रहता हूँ।</li><li>सबसे मुश्किल सीख: <b>delegate करना</b> और team पर भरोसा करना, सब खुद न करना।</li></ul>"
},

/* ============================ JAVA CORE (more) ============================ */
{
  id: "java-8", category: "Java Core", difficulty: "easy",
  question: "Why is Java platform-independent?",
  answerEn: "<p>Java source (<code class='inline'>.java</code>) is compiled into <b>bytecode</b> (<code class='inline'>.class</code>) — not native machine code. That bytecode runs on the <b>JVM</b>, and a JVM exists for each OS (Windows, Linux, Mac). So the <b>same</b> compiled bytecode runs everywhere — 'write once, run anywhere'. The JVM is platform-<i>dependent</i>; your bytecode is platform-<i>independent</i>.</p>",
  answerHi: "<p>Java का source (<code class='inline'>.java</code>) पहले <b>bytecode</b> (<code class='inline'>.class</code>) में compile होता है — सीधे machine code में नहीं। ये bytecode <b>JVM</b> पर चलता है, और हर OS (Windows, Linux, Mac) के लिए अलग JVM होता है। इसलिए एक ही bytecode हर जगह चलता है — 'write once, run anywhere'। JVM platform पर निर्भर है, पर आपका bytecode नहीं।</p>"
},
{
  id: "java-9", category: "Java Core", difficulty: "easy",
  question: "Difference between JDK, JRE and JVM?",
  answerEn: "<ul><li><b>JVM</b> (Java Virtual Machine) — the engine that loads and executes bytecode. Handles memory, GC, JIT compilation.</li><li><b>JRE</b> (Java Runtime Environment) = JVM + core libraries needed to <b>run</b> Java apps.</li><li><b>JDK</b> (Java Development Kit) = JRE + development tools (compiler <code class='inline'>javac</code>, debugger, etc.) needed to <b>build</b> Java apps.</li></ul><p>Nesting: <b>JDK ⊃ JRE ⊃ JVM</b>. Use the JDK to develop, the JRE to run.</p>",
  answerHi: "<ul><li><b>JVM</b> — bytecode को load करके चलाने वाला engine (memory, GC, JIT)।</li><li><b>JRE</b> = JVM + core libraries, जो Java app <b>चलाने</b> के लिए ज़रूरी हैं।</li><li><b>JDK</b> = JRE + development tools (compiler <code class='inline'>javac</code>, debugger), जो app <b>बनाने</b> के लिए ज़रूरी हैं।</li></ul><p>यानी <b>JDK ⊃ JRE ⊃ JVM</b>। बनाने के लिए JDK, चलाने के लिए JRE।</p>"
},
{
  id: "java-10", category: "Java Core", difficulty: "medium",
  question: "What is an immutable object and why is String immutable?",
  answerEn: "<p>An <b>immutable</b> object's state can't change after creation — any 'modification' returns a new object. <code class='inline'>s.concat(\" Java\")</code> leaves the original <code class='inline'>s</code> unchanged.</p><p><b>Why String is immutable:</b></p><ul><li><b>String pool</b> — literals are shared safely; mutation would corrupt others.</li><li><b>Thread safety</b> — immutable objects are inherently thread-safe.</li><li><b>Security</b> — safe as file paths, DB URLs, class names.</li><li><b>HashMap key stability</b> — cached hashCode stays valid.</li></ul><p>Make your own class immutable with <code class='inline'>final</code> fields, no setters, and defensive copies.</p>",
  answerHi: "<p><b>Immutable</b> object का state बनने के बाद बदल नहीं सकता — कोई भी 'बदलाव' नया object देता है। <code class='inline'>s.concat(\" Java\")</code> करने पर original <code class='inline'>s</code> वैसा ही रहता है।</p><p><b>String immutable क्यों:</b></p><ul><li><b>String pool</b> — literals safely share होते हैं।</li><li><b>Thread safety</b> — immutable अपने-आप thread-safe।</li><li><b>Security</b> — file path, DB URL आदि के लिए safe।</li><li><b>HashMap key stability</b> — cached hashCode valid रहता है।</li></ul><p>अपनी class immutable बनाओ: <code class='inline'>final</code> fields, कोई setter नहीं, defensive copy।</p>"
},
{
  id: "java-11", category: "Java Core", difficulty: "easy",
  question: "Difference between == and equals()?",
  answerEn: "<p><code class='inline'>==</code> compares <b>references</b> (do both point to the same object in memory). <code class='inline'>equals()</code> compares <b>content/value</b> (as overridden, e.g. in String).</p><p>Two <code class='inline'>new String(\"Java\")</code> objects are <code class='inline'>==</code> false (different objects) but <code class='inline'>equals()</code> true (same characters). For primitives, <code class='inline'>==</code> compares values directly.</p>",
  answerHi: "<p><code class='inline'>==</code> <b>reference</b> compare करता है (दोनों memory में एक ही object की ओर हैं?)। <code class='inline'>equals()</code> <b>content/value</b> compare करता है (जैसे String में override किया गया)।</p><p>दो <code class='inline'>new String(\"Java\")</code> objects <code class='inline'>==</code> से false (अलग objects) पर <code class='inline'>equals()</code> से true (same characters)। Primitives के लिए <code class='inline'>==</code> सीधे value compare करता है।</p>",
  code: "String a = new String(\"Java\");\nString b = new String(\"Java\");\nSystem.out.println(a == b);      // false (different refs)\nSystem.out.println(a.equals(b)); // true  (same content)"
},

/* ============================ OOP ============================ */
{
  id: "oop-1", category: "OOP", difficulty: "easy",
  question: "What are the four pillars of OOP?",
  answerEn: "<ul><li><b>Encapsulation</b> — bundle data + behavior, hide internals behind methods (private fields, getters/setters).</li><li><b>Abstraction</b> — expose <i>what</i> an object does, hide <i>how</i> (interfaces, abstract classes).</li><li><b>Inheritance</b> — a subclass reuses/extends a parent's behavior (<code class='inline'>is-a</code>).</li><li><b>Polymorphism</b> — one interface, many implementations (overloading = compile-time, overriding = runtime).</li></ul>",
  answerHi: "<ul><li><b>Encapsulation</b> — data + behavior एक साथ, internals को methods के पीछे छुपाना (private fields, getters/setters)।</li><li><b>Abstraction</b> — object <i>क्या</i> करता है दिखाना, <i>कैसे</i> छुपाना (interface, abstract class)।</li><li><b>Inheritance</b> — subclass parent का behavior reuse/extend करे (<code class='inline'>is-a</code>)।</li><li><b>Polymorphism</b> — एक interface, कई implementations (overloading = compile-time, overriding = runtime)।</li></ul>"
},
{
  id: "oop-2", category: "OOP", difficulty: "medium",
  question: "Overloading vs Overriding (compile-time vs runtime polymorphism)?",
  answerEn: "<p><b>Overloading</b> (compile-time polymorphism): same method name, <b>different parameters</b> in the same class. Resolved by the compiler.</p><p><b>Overriding</b> (runtime polymorphism): a subclass provides a <b>new implementation</b> of a parent method with the <b>same signature</b>. Resolved at runtime based on the actual object (dynamic dispatch). Use <code class='inline'>@Override</code>.</p>",
  answerHi: "<p><b>Overloading</b> (compile-time polymorphism): same method name पर <b>अलग parameters</b>, एक ही class में। Compiler तय करता है।</p><p><b>Overriding</b> (runtime polymorphism): subclass parent के method का <b>same signature</b> के साथ <b>नया implementation</b> देता है। Runtime पर असली object के हिसाब से तय होता है (dynamic dispatch)। <code class='inline'>@Override</code> use करो।</p>",
  code: "class Animal { void sound() { System.out.println(\"...\"); } }\nclass Dog extends Animal {\n    @Override void sound() { System.out.println(\"Bark\"); }\n}\nAnimal a = new Dog();\na.sound(); // \"Bark\" — decided at runtime"
},
{
  id: "oop-3", category: "OOP", difficulty: "medium",
  question: "Abstraction vs Encapsulation — what's the difference?",
  answerEn: "<p>They're related but distinct:</p><ul><li><b>Abstraction</b> is about <b>design</b> — hiding complexity by exposing only essential behavior. Achieved with <b>interfaces / abstract classes</b>. Answers 'what does it do?'</li><li><b>Encapsulation</b> is about <b>implementation</b> — protecting internal state by restricting direct access. Achieved with <b>access modifiers</b> (private) + getters/setters. Answers 'how is the data protected?'</li></ul><p>Abstraction hides <i>complexity</i>; encapsulation hides <i>data</i>.</p>",
  answerHi: "<p>दोनों जुड़े हैं पर अलग:</p><ul><li><b>Abstraction</b> — <b>design</b> की बात, सिर्फ़ ज़रूरी behavior दिखाकर complexity छुपाना। <b>interface / abstract class</b> से। 'ये क्या करता है?'</li><li><b>Encapsulation</b> — <b>implementation</b> की बात, internal state को direct access से बचाना। <b>access modifiers</b> (private) + getters/setters से। 'data कैसे protect है?'</li></ul><p>Abstraction <i>complexity</i> छुपाता है; encapsulation <i>data</i>।</p>"
},
{
  id: "oop-4", category: "OOP", difficulty: "medium",
  question: "Interface vs Abstract class — when to use which?",
  answerEn: "<ul><li><b>Abstract class</b> — can have state (fields), constructors, and both abstract + concrete methods. A class extends <b>one</b>. Use for a shared base with common code (<code class='inline'>is-a</code>).</li><li><b>Interface</b> — a contract; since Java 8 can have <code class='inline'>default</code>/<code class='inline'>static</code> methods but no instance state. A class implements <b>many</b>. Use for capabilities across unrelated types (<code class='inline'>can-do</code>).</li></ul><p>Rule: 'is-a with shared code' → abstract class; 'multiple capabilities / pure contract' → interface.</p>",
  answerHi: "<ul><li><b>Abstract class</b> — इसमें state (fields), constructor, और abstract + concrete दोनों methods हो सकते हैं। Class सिर्फ़ <b>एक</b> extend करती है। Common code वाले base के लिए (<code class='inline'>is-a</code>)।</li><li><b>Interface</b> — contract; Java 8 से <code class='inline'>default</code>/<code class='inline'>static</code> methods पर instance state नहीं। Class <b>कई</b> implement कर सकती है (<code class='inline'>can-do</code>)।</li></ul><p>नियम: 'is-a + shared code' → abstract class; 'कई capabilities / pure contract' → interface।</p>"
},

/* ============================ COLLECTIONS ============================ */
{
  id: "col-1", category: "Collections", difficulty: "easy",
  question: "ArrayList vs LinkedList — differences and when to use?",
  answerEn: "<ul><li><b>ArrayList</b> — backed by a resizable array. <b>Fast random access</b> O(1) by index; slow insert/delete in the middle O(n) due to shifting.</li><li><b>LinkedList</b> — doubly linked nodes. <b>Fast insert/delete</b> at ends O(1); slow random access O(n).</li></ul><p><b>Use ArrayList</b> for read-heavy, index-based access (most cases). <b>Use LinkedList</b> only when you do lots of insertions/removals at the front/middle. In practice ArrayList wins most of the time.</p>",
  answerHi: "<ul><li><b>ArrayList</b> — resizable array पर आधारित। <b>Random access तेज़</b> O(1); बीच में insert/delete slow O(n) (shifting)।</li><li><b>LinkedList</b> — doubly linked nodes। सिरों पर <b>insert/delete तेज़</b> O(1); random access slow O(n)।</li></ul><p><b>ArrayList</b> read-heavy, index-based access के लिए (ज़्यादातर)। <b>LinkedList</b> तभी जब front/middle पर बहुत insert/delete हो। असल में अक्सर ArrayList ही बेहतर।</p>"
},
{
  id: "col-2", category: "Collections", difficulty: "medium",
  question: "HashMap vs Hashtable vs ConcurrentHashMap?",
  answerEn: "<ul><li><b>HashMap</b> — not synchronized, allows one null key and null values, fast. Use in single-threaded code.</li><li><b>Hashtable</b> — legacy, fully synchronized (whole-object lock), no null key/values, slow. Avoid in new code.</li><li><b>ConcurrentHashMap</b> — thread-safe with high concurrency via bucket-level locking/CAS, no nulls. Preferred for multi-threaded maps.</li></ul>",
  answerHi: "<ul><li><b>HashMap</b> — synchronized नहीं, एक null key और null values allowed, fast। Single-threaded के लिए।</li><li><b>Hashtable</b> — पुराना, पूरी तरह synchronized (whole-object lock), null key/value नहीं, slow। नए code में avoid।</li><li><b>ConcurrentHashMap</b> — bucket-level lock/CAS से thread-safe + high concurrency, null नहीं। Multi-threaded के लिए best।</li></ul>"
},
{
  id: "col-3", category: "Collections", difficulty: "medium",
  question: "Fail-fast vs fail-safe iterators?",
  answerEn: "<p><b>Fail-fast</b> iterators (ArrayList, HashMap) throw <code class='inline'>ConcurrentModificationException</code> if the collection is structurally modified during iteration (they track a modCount). They operate on the original collection.</p><p><b>Fail-safe</b> iterators (CopyOnWriteArrayList, ConcurrentHashMap) iterate over a <b>copy/snapshot</b>, so concurrent modification doesn't throw — but you may not see the latest changes. Safe removal during iteration uses <code class='inline'>iterator.remove()</code>.</p>",
  answerHi: "<p><b>Fail-fast</b> iterators (ArrayList, HashMap) — iteration के बीच collection structurally बदले तो <code class='inline'>ConcurrentModificationException</code> फेंकते हैं (modCount track करते हैं)। ये original collection पर चलते हैं।</p><p><b>Fail-safe</b> iterators (CopyOnWriteArrayList, ConcurrentHashMap) — <b>copy/snapshot</b> पर चलते हैं, इसलिए exception नहीं आता, पर latest changes शायद न दिखें। Iteration में safe removal के लिए <code class='inline'>iterator.remove()</code>।</p>"
},
{
  id: "col-4", category: "Collections", difficulty: "medium",
  question: "Comparable vs Comparator?",
  answerEn: "<p><b>Comparable</b> — the class defines its <b>natural ordering</b> via <code class='inline'>compareTo()</code> (one sort logic, e.g. sort by id). Implemented by the object itself.</p><p><b>Comparator</b> — an <b>external</b> strategy via <code class='inline'>compare()</code>, letting you define multiple orderings (by name, by date) without changing the class. Great with <code class='inline'>Comparator.comparing()</code> and <code class='inline'>thenComparing()</code>.</p>",
  answerHi: "<p><b>Comparable</b> — class खुद अपनी <b>natural ordering</b> <code class='inline'>compareTo()</code> से बताती है (एक ही sort logic, जैसे id से)। Object खुद implement करता है।</p><p><b>Comparator</b> — <b>बाहरी</b> strategy <code class='inline'>compare()</code> से, ताकि class बदले बिना कई ordering (name, date से) बना सकें। <code class='inline'>Comparator.comparing()</code> और <code class='inline'>thenComparing()</code> के साथ बढ़िया।</p>",
  code: "list.sort(Comparator.comparing(User::getName)\n        .thenComparing(User::getAge));"
},

/* ============================ EXCEPTIONS ============================ */
{
  id: "exc-1", category: "Exceptions", difficulty: "easy",
  question: "Checked vs Unchecked exceptions?",
  answerEn: "<p><b>Checked</b> exceptions are checked at <b>compile time</b> — you must handle or declare them (<code class='inline'>IOException</code>, <code class='inline'>SQLException</code>). They extend <code class='inline'>Exception</code>. Use for recoverable, expected conditions.</p><p><b>Unchecked</b> (runtime) exceptions extend <code class='inline'>RuntimeException</code> (<code class='inline'>NullPointerException</code>, <code class='inline'>IllegalArgumentException</code>, <code class='inline'>ArrayIndexOutOfBounds</code>). Not enforced by the compiler — usually programming bugs.</p>",
  answerHi: "<p><b>Checked</b> exceptions <b>compile time</b> पर check होते हैं — इन्हें handle या declare करना ज़रूरी है (<code class='inline'>IOException</code>, <code class='inline'>SQLException</code>)। ये <code class='inline'>Exception</code> extend करते हैं। Recoverable, expected स्थितियों के लिए।</p><p><b>Unchecked</b> (runtime) exceptions <code class='inline'>RuntimeException</code> extend करते हैं (<code class='inline'>NullPointerException</code>, <code class='inline'>IllegalArgumentException</code>)। Compiler enforce नहीं करता — आमतौर पर programming bug।</p>"
},
{
  id: "exc-2", category: "Exceptions", difficulty: "easy",
  question: "throw vs throws, and try-with-resources?",
  answerEn: "<p><b>throw</b> — a statement that actually <b>throws</b> an exception instance: <code class='inline'>throw new IllegalStateException();</code></p><p><b>throws</b> — a method declaration saying it <b>may throw</b> checked exceptions: <code class='inline'>void read() throws IOException</code>.</p><p><b>try-with-resources</b> auto-closes resources implementing <code class='inline'>AutoCloseable</code> — no manual <code class='inline'>finally</code> to close, avoids leaks.</p>",
  answerHi: "<p><b>throw</b> — statement जो सच में exception <b>फेंकता</b> है: <code class='inline'>throw new IllegalStateException();</code></p><p><b>throws</b> — method declaration जो बताता है कि ये checked exception <b>फेंक सकता</b> है: <code class='inline'>void read() throws IOException</code>।</p><p><b>try-with-resources</b> — <code class='inline'>AutoCloseable</code> resources अपने-आप close करता है, manual <code class='inline'>finally</code> की ज़रूरत नहीं, leaks नहीं।</p>",
  code: "try (BufferedReader br = new BufferedReader(new FileReader(f))) {\n    return br.readLine();\n} // br auto-closed here"
},

/* ============================ MULTITHREADING ============================ */
{
  id: "mt-1", category: "Multithreading", difficulty: "medium",
  question: "Explain the thread lifecycle.",
  answerEn: "<p>A thread moves through these states:</p><ul><li><b>New</b> — created but not started.</li><li><b>Runnable</b> — <code class='inline'>start()</code> called, ready/running (scheduler decides).</li><li><b>Blocked</b> — waiting to acquire a monitor lock.</li><li><b>Waiting / Timed Waiting</b> — <code class='inline'>wait()</code>, <code class='inline'>join()</code>, <code class='inline'>sleep(ms)</code>.</li><li><b>Terminated</b> — <code class='inline'>run()</code> finished or thread died.</li></ul><p>Never call <code class='inline'>run()</code> directly — that runs on the current thread; use <code class='inline'>start()</code>.</p>",
  answerHi: "<p>Thread इन states से गुज़रता है:</p><ul><li><b>New</b> — बना पर start नहीं हुआ।</li><li><b>Runnable</b> — <code class='inline'>start()</code> हुआ, ready/running (scheduler तय करे)।</li><li><b>Blocked</b> — monitor lock के लिए इंतज़ार।</li><li><b>Waiting / Timed Waiting</b> — <code class='inline'>wait()</code>, <code class='inline'>join()</code>, <code class='inline'>sleep(ms)</code>।</li><li><b>Terminated</b> — <code class='inline'>run()</code> खत्म।</li></ul><p><code class='inline'>run()</code> सीधे मत call करो (वो current thread पर चलता है); <code class='inline'>start()</code> use करो।</p>"
},
{
  id: "mt-2", category: "Multithreading", difficulty: "medium",
  question: "Runnable vs Callable?",
  answerEn: "<ul><li><b>Runnable</b> — <code class='inline'>run()</code> returns <b>void</b> and can't throw checked exceptions.</li><li><b>Callable&lt;V&gt;</b> — <code class='inline'>call()</code> <b>returns a value</b> and can throw checked exceptions.</li></ul><p>Submit a <code class='inline'>Callable</code> to an <code class='inline'>ExecutorService</code> and get a <code class='inline'>Future&lt;V&gt;</code> to retrieve the result later with <code class='inline'>future.get()</code>.</p>",
  answerHi: "<ul><li><b>Runnable</b> — <code class='inline'>run()</code> <b>void</b> लौटाता है, checked exception नहीं फेंक सकता।</li><li><b>Callable&lt;V&gt;</b> — <code class='inline'>call()</code> <b>value लौटाता</b> है और checked exception फेंक सकता है।</li></ul><p><code class='inline'>Callable</code> को <code class='inline'>ExecutorService</code> में submit करो, <code class='inline'>Future&lt;V&gt;</code> मिलता है जिससे बाद में <code class='inline'>future.get()</code> से result लो।</p>"
},
{
  id: "mt-3", category: "Multithreading", difficulty: "hard",
  question: "What is synchronized and how do deadlocks happen?",
  answerEn: "<p><code class='inline'>synchronized</code> lets only one thread enter a critical section at a time (acquires the object's monitor lock), preventing race conditions.</p><p><b>Deadlock</b> occurs when two threads each hold a lock the other needs and both wait forever (e.g. T1 holds A wants B; T2 holds B wants A).</p><p><b>Avoid it by:</b> acquiring locks in a consistent global order, using <code class='inline'>tryLock</code> with timeout, minimizing lock scope, and preferring higher-level concurrency utilities over manual locks.</p>",
  answerHi: "<p><code class='inline'>synchronized</code> एक बार में सिर्फ़ एक thread को critical section में जाने देता है (object का monitor lock लेता है), race condition रुकती है।</p><p><b>Deadlock</b> तब जब दो threads एक-दूसरे को चाहिए lock पकड़े रहें और हमेशा इंतज़ार करें (T1 के पास A, चाहिए B; T2 के पास B, चाहिए A)।</p><p><b>बचाव:</b> locks हमेशा एक ही order में लो, <code class='inline'>tryLock</code> + timeout, lock का scope छोटा रखो, manual lock की जगह high-level concurrency utilities use करो।</p>"
},
{
  id: "mt-4", category: "Multithreading", difficulty: "medium",
  question: "Why use ExecutorService instead of new Thread()?",
  answerEn: "<p>Creating raw threads per task is expensive and unbounded — under load you can exhaust memory/CPU. An <b>ExecutorService</b> manages a reusable <b>thread pool</b>:</p><ul><li>Reuses threads → less overhead.</li><li>Bounds concurrency → protects resources.</li><li>Queues tasks, supports <code class='inline'>Future</code>, scheduling, and graceful shutdown.</li></ul>",
  answerHi: "<p>हर task के लिए raw thread बनाना महँगा और unbounded है — load में memory/CPU खत्म हो सकते हैं। <b>ExecutorService</b> reusable <b>thread pool</b> manage करता है:</p><ul><li>Threads reuse → कम overhead।</li><li>Concurrency bounded → resources safe।</li><li>Tasks queue, <code class='inline'>Future</code>, scheduling, graceful shutdown।</li></ul>",
  code: "ExecutorService ex = Executors.newFixedThreadPool(5);\nFuture<Integer> f = ex.submit(() -> compute());\nInteger result = f.get();\nex.shutdown();"
},
{
  id: "mt-5", category: "Multithreading", difficulty: "hard",
  question: "volatile vs synchronized vs Atomic?",
  answerEn: "<ul><li><b>volatile</b> — guarantees <b>visibility</b> of a variable across threads (reads/writes go to main memory), but is <b>not atomic</b> for compound ops like <code class='inline'>count++</code>.</li><li><b>synchronized</b> — provides both <b>visibility and atomicity/mutual exclusion</b>, but with locking overhead.</li><li><b>Atomic classes</b> (<code class='inline'>AtomicInteger</code>) — lock-free atomic operations via CAS; ideal for counters.</li></ul><p>Use volatile for a simple status flag, Atomic for counters, synchronized for multi-step critical sections.</p>",
  answerHi: "<ul><li><b>volatile</b> — variable की <b>visibility</b> guarantee करता है (main memory से read/write), पर <code class='inline'>count++</code> जैसे compound op के लिए <b>atomic नहीं</b>।</li><li><b>synchronized</b> — <b>visibility + atomicity/mutual exclusion</b> दोनों, पर locking overhead।</li><li><b>Atomic classes</b> (<code class='inline'>AtomicInteger</code>) — CAS से lock-free atomic ops; counters के लिए best।</li></ul><p>Simple flag → volatile, counter → Atomic, multi-step critical section → synchronized।</p>"
},

/* ============================ JAVA 8 ============================ */
{
  id: "j8-1", category: "Java 8", difficulty: "easy",
  question: "What is a functional interface? Give examples.",
  answerEn: "<p>A <b>functional interface</b> has exactly <b>one abstract method</b> (SAM), so it can be a target for a lambda or method reference. Marked with <code class='inline'>@FunctionalInterface</code> (optional but enforces the rule).</p><p><b>Examples:</b> <code class='inline'>Runnable</code>, <code class='inline'>Comparator</code>, <code class='inline'>Callable</code>, and <code class='inline'>java.util.function</code> ones — <code class='inline'>Predicate&lt;T&gt;</code>, <code class='inline'>Function&lt;T,R&gt;</code>, <code class='inline'>Supplier&lt;T&gt;</code>, <code class='inline'>Consumer&lt;T&gt;</code>.</p>",
  answerHi: "<p><b>Functional interface</b> में ठीक <b>एक abstract method</b> (SAM) होता है, इसलिए इसे lambda या method reference से दिया जा सकता है। <code class='inline'>@FunctionalInterface</code> से mark (optional पर rule enforce करता है)।</p><p><b>Examples:</b> <code class='inline'>Runnable</code>, <code class='inline'>Comparator</code>, <code class='inline'>Callable</code>, और <code class='inline'>java.util.function</code> वाले — <code class='inline'>Predicate</code>, <code class='inline'>Function</code>, <code class='inline'>Supplier</code>, <code class='inline'>Consumer</code>।</p>"
},
{
  id: "j8-2", category: "Java 8", difficulty: "easy",
  question: "What are lambda expressions and why are they useful?",
  answerEn: "<p>A <b>lambda</b> is a concise way to implement a functional interface inline — <code class='inline'>(args) -&gt; body</code>. It replaces verbose anonymous classes, enabling functional-style code.</p>",
  answerHi: "<p><b>Lambda</b> functional interface को inline लागू करने का छोटा तरीका है — <code class='inline'>(args) -&gt; body</code>। ये लंबे anonymous classes की जगह लेता है और functional-style code देता है।</p>",
  code: "// Before\nlist.sort(new Comparator<Integer>() {\n    public int compare(Integer a, Integer b) { return a - b; }\n});\n// After\nlist.sort((a, b) -> a - b);"
},
{
  id: "j8-3", category: "Java 8", difficulty: "medium",
  question: "Difference between map() and flatMap() in Streams?",
  answerEn: "<p><b>map()</b> transforms each element 1→1 and produces a stream of the same shape (<code class='inline'>Stream&lt;A&gt;</code> → <code class='inline'>Stream&lt;B&gt;</code>).</p><p><b>flatMap()</b> transforms each element into a <b>stream</b> and then <b>flattens</b> all of them into one stream — used to flatten nested structures like <code class='inline'>List&lt;List&lt;T&gt;&gt;</code> into <code class='inline'>Stream&lt;T&gt;</code>.</p>",
  answerHi: "<p><b>map()</b> हर element को 1→1 बदलता है, same shape का stream देता है (<code class='inline'>Stream&lt;A&gt;</code> → <code class='inline'>Stream&lt;B&gt;</code>)।</p><p><b>flatMap()</b> हर element को <b>stream</b> में बदलकर सबको एक stream में <b>flatten</b> करता है — nested structure जैसे <code class='inline'>List&lt;List&lt;T&gt;&gt;</code> को <code class='inline'>Stream&lt;T&gt;</code> बनाने के लिए।</p>",
  code: "List<List<String>> nested = ...;\nList<String> flat = nested.stream()\n    .flatMap(List::stream)\n    .collect(Collectors.toList());"
},
{
  id: "j8-4", category: "Java 8", difficulty: "easy",
  question: "What is Optional and how do you use it well?",
  answerEn: "<p><code class='inline'>Optional&lt;T&gt;</code> is a container that may or may not hold a value — it makes 'no value' explicit and helps avoid <code class='inline'>NullPointerException</code>.</p><ul><li>Create: <code class='inline'>Optional.of</code>, <code class='inline'>ofNullable</code>, <code class='inline'>empty</code>.</li><li>Consume: <code class='inline'>map</code>, <code class='inline'>filter</code>, <code class='inline'>orElse</code>, <code class='inline'>orElseThrow</code>, <code class='inline'>ifPresent</code>.</li></ul><p>Best used as a <b>return type</b>; avoid using it for fields or method parameters.</p>",
  answerHi: "<p><code class='inline'>Optional&lt;T&gt;</code> एक container है जिसमें value हो भी सकती है और नहीं भी — ये 'value नहीं है' को साफ़ बनाता है और <code class='inline'>NullPointerException</code> से बचाता है।</p><ul><li>बनाना: <code class='inline'>Optional.of</code>, <code class='inline'>ofNullable</code>, <code class='inline'>empty</code>।</li><li>उपयोग: <code class='inline'>map</code>, <code class='inline'>orElse</code>, <code class='inline'>orElseThrow</code>, <code class='inline'>ifPresent</code>।</li></ul><p>इसे <b>return type</b> की तरह use करो; fields/parameters में मत use करो।</p>"
},

/* ============================ SPRING BOOT (more) ============================ */
{
  id: "sb-1", category: "Spring Boot", difficulty: "easy",
  question: "Why Spring Boot? What problems does it solve?",
  answerEn: "<ul><li><b>Auto-configuration</b> — sensible defaults based on the classpath, minimal XML/boilerplate.</li><li><b>Starter dependencies</b> — one starter pulls a curated, compatible set of libraries.</li><li><b>Embedded server</b> (Tomcat/Jetty) — run as a standalone JAR, no external server.</li><li><b>Production-ready</b> — Actuator for health, metrics; easy externalized config.</li></ul><p>Net effect: go from zero to a running REST service in minutes.</p>",
  answerHi: "<ul><li><b>Auto-configuration</b> — classpath के हिसाब से sensible defaults, कम XML/boilerplate।</li><li><b>Starter dependencies</b> — एक starter compatible libraries का set लाता है।</li><li><b>Embedded server</b> (Tomcat) — standalone JAR, बाहरी server नहीं।</li><li><b>Production-ready</b> — Actuator (health, metrics), आसान externalized config।</li></ul><p>नतीजा: कुछ ही मिनटों में चलती हुई REST service।</p>"
},
{
  id: "sb-2", category: "Spring Boot", difficulty: "easy",
  question: "@Component vs @Service vs @Repository vs @Controller?",
  answerEn: "<p>All are Spring-managed beans (stereotypes of <code class='inline'>@Component</code>); the names convey intent and add behavior:</p><ul><li><b>@Component</b> — generic bean.</li><li><b>@Service</b> — business-logic layer.</li><li><b>@Repository</b> — data-access layer; also translates persistence exceptions into Spring's <code class='inline'>DataAccessException</code>.</li><li><b>@Controller / @RestController</b> — web layer handling HTTP requests.</li></ul>",
  answerHi: "<p>ये सब Spring-managed beans हैं (<code class='inline'>@Component</code> के stereotypes); नाम intent बताते हैं और कुछ behavior जोड़ते हैं:</p><ul><li><b>@Component</b> — generic bean।</li><li><b>@Service</b> — business-logic layer।</li><li><b>@Repository</b> — data-access layer; persistence exceptions को Spring के <code class='inline'>DataAccessException</code> में बदलता है।</li><li><b>@Controller / @RestController</b> — web layer, HTTP requests संभालता है।</li></ul>"
},
{
  id: "sb-3", category: "Spring Boot", difficulty: "medium",
  question: "Explain the Spring MVC request flow (DispatcherServlet).",
  answerEn: "<p>Request lifecycle in Spring MVC:</p><ul><li>Client request hits the <b>DispatcherServlet</b> (front controller).</li><li>It consults <b>HandlerMapping</b> to find the right <b>Controller</b> method.</li><li>Controller calls the <b>Service</b> → <b>Repository</b> → database, and returns data/model.</li><li>For REST, <code class='inline'>@RestController</code> serializes the return value to JSON via <code class='inline'>HttpMessageConverter</code>; for MVC, a <b>ViewResolver</b> renders a view.</li><li>Response goes back to the client.</li></ul>",
  answerHi: "<p>Spring MVC में request का सफ़र:</p><ul><li>Request <b>DispatcherServlet</b> (front controller) पर आती है।</li><li>वो <b>HandlerMapping</b> से सही <b>Controller</b> method ढूँढता है।</li><li>Controller <b>Service</b> → <b>Repository</b> → database call करके data लौटाता है।</li><li>REST में <code class='inline'>@RestController</code> return value को <code class='inline'>HttpMessageConverter</code> से JSON बनाता है; MVC में <b>ViewResolver</b> view render करता है।</li><li>Response client को वापस।</li></ul>"
},
{
  id: "sb-4", category: "Spring Boot", difficulty: "medium",
  question: "How do profiles and externalized configuration work?",
  answerEn: "<p>Spring Boot reads config from <code class='inline'>application.properties</code>/<code class='inline'>.yml</code>, environment variables, and command-line args (with a defined precedence).</p><p><b>Profiles</b> let you have environment-specific config: <code class='inline'>application-dev.yml</code>, <code class='inline'>application-prod.yml</code>, activated via <code class='inline'>spring.profiles.active=prod</code>. Inject values with <code class='inline'>@Value</code> or bind groups with <code class='inline'>@ConfigurationProperties</code>. This means the same JAR runs in any environment without a rebuild.</p>",
  answerHi: "<p>Spring Boot config को <code class='inline'>application.properties</code>/<code class='inline'>.yml</code>, environment variables और command-line args से पढ़ता है (एक तय precedence के साथ)।</p><p><b>Profiles</b> से environment-wise config: <code class='inline'>application-dev.yml</code>, <code class='inline'>application-prod.yml</code>, <code class='inline'>spring.profiles.active=prod</code> से activate। Values <code class='inline'>@Value</code> या <code class='inline'>@ConfigurationProperties</code> से inject। यानी एक ही JAR बिना rebuild हर environment में चले।</p>"
},

/* ============================ REST APIs ============================ */
{
  id: "rest-1", category: "REST APIs", difficulty: "easy",
  question: "Explain the main HTTP methods in REST.",
  answerEn: "<ul><li><b>GET</b> — retrieve data (safe, idempotent, no body).</li><li><b>POST</b> — create a new resource (not idempotent).</li><li><b>PUT</b> — full update/replace a resource (idempotent).</li><li><b>PATCH</b> — partial update (usually not idempotent).</li><li><b>DELETE</b> — remove a resource (idempotent).</li></ul>",
  answerHi: "<ul><li><b>GET</b> — data लाना (safe, idempotent, no body)।</li><li><b>POST</b> — नया resource बनाना (idempotent नहीं)।</li><li><b>PUT</b> — पूरा update/replace (idempotent)।</li><li><b>PATCH</b> — partial update (आमतौर पर idempotent नहीं)।</li><li><b>DELETE</b> — resource हटाना (idempotent)।</li></ul>"
},
{
  id: "rest-2", category: "REST APIs", difficulty: "easy",
  question: "Common HTTP status codes you should know?",
  answerEn: "<ul><li><b>2xx Success:</b> 200 OK, 201 Created, 204 No Content.</li><li><b>3xx Redirect:</b> 301 Moved, 304 Not Modified.</li><li><b>4xx Client error:</b> 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests.</li><li><b>5xx Server error:</b> 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.</li></ul>",
  answerHi: "<ul><li><b>2xx Success:</b> 200 OK, 201 Created, 204 No Content।</li><li><b>3xx Redirect:</b> 301 Moved, 304 Not Modified।</li><li><b>4xx Client error:</b> 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests।</li><li><b>5xx Server error:</b> 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable।</li></ul>"
},
{
  id: "rest-3", category: "REST APIs", difficulty: "medium",
  question: "What makes a REST API RESTful? (principles & best practices)",
  answerEn: "<ul><li><b>Statelessness</b> — each request carries all needed info; no server session.</li><li><b>Resource-based URIs</b> — nouns not verbs (<code class='inline'>/orders/123</code>), use HTTP methods for actions.</li><li><b>Proper status codes</b> and consistent JSON responses.</li><li><b>Versioning</b> (<code class='inline'>/v1/</code>), pagination, filtering for collections.</li><li><b>HATEOAS</b> (optional) — responses include links to related actions.</li></ul>",
  answerHi: "<ul><li><b>Statelessness</b> — हर request में पूरी ज़रूरी info; server session नहीं।</li><li><b>Resource-based URIs</b> — verbs नहीं nouns (<code class='inline'>/orders/123</code>), actions के लिए HTTP methods।</li><li><b>सही status codes</b> और consistent JSON responses।</li><li><b>Versioning</b> (<code class='inline'>/v1/</code>), pagination, filtering।</li><li><b>HATEOAS</b> (optional) — response में related actions के links।</li></ul>"
},

/* ============================ MICROSERVICES (more) ============================ */
{
  id: "micro-7", category: "Microservices", difficulty: "medium",
  question: "How do you achieve observability (logging, tracing, monitoring)?",
  answerEn: "<p>In a distributed system you need three pillars:</p><ul><li><b>Centralized logging</b> — ship logs to ELK/Loki with a shared <b>correlation/trace ID</b> so you can follow one request across services.</li><li><b>Distributed tracing</b> — tools like Zipkin/Jaeger (via Micrometer/OpenTelemetry) show the full call path and latency per hop.</li><li><b>Metrics + monitoring</b> — Micrometer → Prometheus → Grafana dashboards, with alerts on error rate/latency.</li></ul><p>Add health checks (Actuator) and structured logs.</p>",
  answerHi: "<p>Distributed system में तीन pillars चाहिए:</p><ul><li><b>Centralized logging</b> — logs ELK/Loki में भेजो, एक shared <b>correlation/trace ID</b> के साथ ताकि एक request को services भर follow कर सको।</li><li><b>Distributed tracing</b> — Zipkin/Jaeger (Micrometer/OpenTelemetry) पूरा call path और हर hop की latency दिखाते हैं।</li><li><b>Metrics + monitoring</b> — Micrometer → Prometheus → Grafana, error rate/latency पर alerts।</li></ul><p>Health checks (Actuator) और structured logs जोड़ो।</p>"
},
{
  id: "micro-8", category: "Microservices", difficulty: "medium",
  question: "Why database-per-service, and what challenges does it create?",
  answerEn: "<p><b>Database per service</b> means each service owns its schema — no other service touches it directly. This gives loose coupling, independent scaling, and freedom to pick the right DB.</p><p><b>Challenges:</b> no cross-service joins or single ACID transaction. You solve consistency with the <b>Saga pattern</b> + events, share data via APIs or replication, and may keep read-optimized copies (CQRS). Reporting needs data aggregation (e.g. into a warehouse).</p>",
  answerHi: "<p><b>Database per service</b> यानी हर service का अपना schema — कोई दूसरी service उसे सीधे न छुए। इससे loose coupling, independent scaling और सही DB चुनने की आज़ादी मिलती है।</p><p><b>चुनौतियाँ:</b> cross-service join या single ACID transaction नहीं। Consistency के लिए <b>Saga pattern</b> + events, data APIs/replication से share, read के लिए copies (CQRS)। Reporting के लिए data aggregate (warehouse)।</p>"
},

/* ============================ DATABASES (more) ============================ */
{
  id: "db-5", category: "Databases & SQL", difficulty: "easy",
  question: "DELETE vs TRUNCATE vs DROP?",
  answerEn: "<ul><li><b>DELETE</b> — DML; removes rows (optionally with <code class='inline'>WHERE</code>); logged per row; <b>can be rolled back</b>; fires triggers.</li><li><b>TRUNCATE</b> — DDL; removes <b>all</b> rows fast, resets identity; minimal logging; usually can't be rolled back; no row triggers.</li><li><b>DROP</b> — DDL; deletes the <b>entire table</b> (structure + data).</li></ul>",
  answerHi: "<ul><li><b>DELETE</b> — DML; rows हटाता है (<code class='inline'>WHERE</code> के साथ); per-row logged; <b>rollback हो सकता</b> है; triggers चलते हैं।</li><li><b>TRUNCATE</b> — DDL; <b>सारी</b> rows तेज़ी से हटाता है, identity reset; minimal logging; आमतौर पर rollback नहीं; row triggers नहीं।</li><li><b>DROP</b> — DDL; पूरी <b>table</b> (structure + data) हटा देता है।</li></ul>"
},
{
  id: "db-6", category: "Databases & SQL", difficulty: "medium",
  question: "What is normalization? When would you denormalize?",
  answerEn: "<p><b>Normalization</b> organizes data to reduce redundancy and anomalies by splitting into related tables (1NF: atomic values; 2NF: no partial dependency; 3NF: no transitive dependency).</p><p><b>Denormalization</b> deliberately adds redundancy (duplicate columns, precomputed aggregates) to speed up reads and avoid expensive joins — common in read-heavy/reporting systems. Trade-off: faster reads, but you must keep duplicates in sync on writes.</p>",
  answerHi: "<p><b>Normalization</b> data को related tables में बाँटकर redundancy और anomalies घटाता है (1NF: atomic values; 2NF: no partial dependency; 3NF: no transitive dependency)।</p><p><b>Denormalization</b> जानबूझकर redundancy जोड़ता है (duplicate columns, precomputed aggregates) ताकि reads तेज़ हों और महँगे joins से बचें — read-heavy/reporting में common। Trade-off: reads तेज़ पर writes पर duplicates sync रखने पड़ते हैं।</p>"
},

/* ============================ SQL PROBLEMS ============================ */
{
  id: "sql-1", category: "Databases & SQL", difficulty: "medium",
  question: "Find the second highest salary from an Employee table.",
  answerEn: "<p>Classic query. Two common approaches — subquery, or a window function which also generalizes to Nth highest.</p><ul><li><b>Subquery:</b> the max salary that is less than the overall max.</li><li><b>Window function:</b> <code class='inline'>DENSE_RANK()</code> then filter rank = 2 (handles ties correctly).</li></ul>",
  answerHi: "<p>Classic query। दो तरीके — subquery, या window function (जो Nth highest तक generalize होता है)।</p><ul><li><b>Subquery:</b> overall max से कम में से max salary।</li><li><b>Window function:</b> <code class='inline'>DENSE_RANK()</code> फिर rank = 2 filter (ties सही संभालता है)।</li></ul>",
  code: "-- Subquery\nSELECT MAX(salary) FROM employee\nWHERE salary < (SELECT MAX(salary) FROM employee);\n\n-- Window function (Nth highest: rn = N)\nSELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) rn\n  FROM employee\n) t WHERE rn = 2;"
},
{
  id: "sql-2", category: "Databases & SQL", difficulty: "easy",
  question: "Find duplicate records in a table.",
  answerEn: "<p>Group by the column(s) that define a duplicate and keep only groups with a count greater than one.</p>",
  answerHi: "<p>जिन column(s) से duplicate बनता है उन पर group करो और सिर्फ़ वो groups रखो जिनका count एक से ज़्यादा हो।</p>",
  code: "SELECT name, COUNT(*) AS cnt\nFROM employee\nGROUP BY name\nHAVING COUNT(*) > 1;"
},

/* ============================ DESIGN PATTERNS ============================ */
{
  id: "dp-1", category: "Design Patterns", difficulty: "medium",
  question: "Explain the Singleton pattern and how to make it safe.",
  answerEn: "<p><b>Singleton</b> ensures a class has only one instance with a global access point (config, connection pool, cache).</p><p><b>Thread-safe approaches:</b> eager init, double-checked locking with a <code class='inline'>volatile</code> field, or best — an <b>enum singleton</b> (thread-safe, serialization-safe, reflection-safe).</p>",
  answerHi: "<p><b>Singleton</b> — class का सिर्फ़ एक instance और global access point (config, connection pool, cache)।</p><p><b>Thread-safe तरीके:</b> eager init, <code class='inline'>volatile</code> के साथ double-checked locking, या सबसे अच्छा — <b>enum singleton</b> (thread-safe, serialization/reflection safe)।</p>",
  code: "public enum Config {\n    INSTANCE;\n    public String get(String key) { /* ... */ return null; }\n}\n// usage: Config.INSTANCE.get(\"url\");"
},
{
  id: "dp-2", category: "Design Patterns", difficulty: "medium",
  question: "Factory vs Builder pattern?",
  answerEn: "<p><b>Factory</b> — creates objects without exposing the instantiation logic; the caller asks for a type and gets the right implementation. Good when the concrete class is decided at runtime.</p><p><b>Builder</b> — constructs a complex/immutable object step by step, avoiding telescoping constructors and making optional fields readable. Good when an object has many optional parameters.</p>",
  answerHi: "<p><b>Factory</b> — object बनाने का logic छुपाकर बनाता है; caller type माँगता है, सही implementation मिलता है। जब concrete class runtime पर तय हो।</p><p><b>Builder</b> — complex/immutable object step-by-step बनाता है, telescoping constructors से बचाता है और optional fields readable रखता है। जब object में कई optional parameters हों।</p>",
  code: "User u = new User.Builder()\n    .name(\"Aakash\")\n    .email(\"a@b.com\")\n    .active(true)\n    .build();"
},

/* ============================ JVM & GC ============================ */
{
  id: "jvm-1", category: "JVM & GC", difficulty: "hard",
  question: "Explain JVM memory areas and the class loading process.",
  answerEn: "<p><b>Memory areas:</b> <b>Heap</b> (objects; Young + Old gen), <b>Stack</b> (per-thread frames/locals), <b>Method Area/Metaspace</b> (class metadata), <b>PC register</b>, and <b>native stack</b>.</p><p><b>Class loading</b> has three phases: <b>Loading</b> (read <code class='inline'>.class</code> bytes), <b>Linking</b> (verify → prepare → resolve), and <b>Initialization</b> (run static initializers). Loaders follow the <b>parent-delegation</b> model: Bootstrap → Platform → Application classloader.</p>",
  answerHi: "<p><b>Memory areas:</b> <b>Heap</b> (objects; Young + Old gen), <b>Stack</b> (per-thread frames/locals), <b>Method Area/Metaspace</b> (class metadata), <b>PC register</b>, <b>native stack</b>।</p><p><b>Class loading</b> तीन phase: <b>Loading</b> (<code class='inline'>.class</code> bytes पढ़ना), <b>Linking</b> (verify → prepare → resolve), <b>Initialization</b> (static initializers चलाना)। Loaders <b>parent-delegation</b> model: Bootstrap → Platform → Application।</p>"
},
{
  id: "jvm-2", category: "JVM & GC", difficulty: "medium",
  question: "How does garbage collection work? What are the GC types?",
  answerEn: "<p>GC reclaims memory of objects that are no longer <b>reachable</b> from GC roots. Based on the generational hypothesis (most objects die young):</p><ul><li><b>Minor GC</b> — cleans the Young gen (Eden + Survivor); frequent, fast; survivors get promoted to Old gen.</li><li><b>Major/Full GC</b> — cleans the Old gen; less frequent, more expensive (longer pauses).</li></ul><p><b>Collectors:</b> Serial, Parallel (throughput), CMS (deprecated), <b>G1</b> (default, region-based, predictable pauses), ZGC/Shenandoah (low-latency).</p>",
  answerHi: "<p>GC उन objects की memory वापस लेता है जो GC roots से <b>reachable</b> नहीं। Generational hypothesis पर (ज़्यादातर objects जल्दी मरते हैं):</p><ul><li><b>Minor GC</b> — Young gen (Eden + Survivor) साफ़; बार-बार, fast; survivors Old gen में promote।</li><li><b>Major/Full GC</b> — Old gen साफ़; कम बार, महँगा (लंबे pauses)।</li></ul><p><b>Collectors:</b> Serial, Parallel, CMS (deprecated), <b>G1</b> (default, region-based, predictable pauses), ZGC/Shenandoah (low-latency)।</p>"
},

/* ============================ CODING PROBLEMS ============================ */
{
  id: "code-1", category: "Coding Problems", difficulty: "easy",
  question: "Reverse a string (and check for a palindrome).",
  answerEn: "<p><b>Reverse:</b> use two pointers swapping from both ends, or <code class='inline'>StringBuilder.reverse()</code>. <b>Palindrome:</b> compare characters from both ends moving inward — O(n) time, O(1) space.</p>",
  answerHi: "<p><b>Reverse:</b> दोनों सिरों से two pointers swap करो, या <code class='inline'>StringBuilder.reverse()</code>। <b>Palindrome:</b> दोनों सिरों से characters अंदर की ओर compare करो — O(n) time, O(1) space।</p>",
  code: "boolean isPalindrome(String s) {\n    int i = 0, j = s.length() - 1;\n    while (i < j) {\n        if (s.charAt(i++) != s.charAt(j--)) return false;\n    }\n    return true;\n}"
},
{
  id: "code-2", category: "Coding Problems", difficulty: "easy",
  question: "Check if two strings are anagrams.",
  answerEn: "<p>Two strings are anagrams if they have the same characters with the same counts. <b>Approach:</b> count character frequencies (int[26] for lowercase, or a HashMap for Unicode) — increment for one string, decrement for the other; all zero means anagram. O(n) time.</p>",
  answerHi: "<p>दो strings anagram हैं अगर उनमें same characters same count में हों। <b>तरीका:</b> character frequency count करो (int[26] या HashMap) — एक string के लिए बढ़ाओ, दूसरी के लिए घटाओ; सब zero तो anagram। O(n) time।</p>",
  code: "boolean isAnagram(String a, String b) {\n    if (a.length() != b.length()) return false;\n    int[] c = new int[26];\n    for (int i = 0; i < a.length(); i++) {\n        c[a.charAt(i) - 'a']++;\n        c[b.charAt(i) - 'a']--;\n    }\n    for (int x : c) if (x != 0) return false;\n    return true;\n}"
},
{
  id: "code-3", category: "Coding Problems", difficulty: "medium",
  question: "Find the missing number in an array of 1..n.",
  answerEn: "<p>Given n-1 distinct numbers from 1..n, find the missing one. <b>Best approach:</b> the expected sum is <code class='inline'>n*(n+1)/2</code>; subtract the actual sum — the difference is the missing number. O(n) time, O(1) space. (XOR of all indices and values also works and avoids overflow.)</p>",
  answerHi: "<p>1..n में से n-1 distinct numbers दिए हैं, missing ढूँढो। <b>Best तरीका:</b> expected sum <code class='inline'>n*(n+1)/2</code> है; actual sum घटाओ — फ़र्क़ ही missing number। O(n) time, O(1) space। (XOR वाला तरीका भी चलता है और overflow से बचाता है।)</p>",
  code: "int missing(int[] a, int n) {\n    long expected = (long) n * (n + 1) / 2;\n    long actual = 0;\n    for (int x : a) actual += x;\n    return (int) (expected - actual);\n}"
},
{
  id: "code-4", category: "Coding Problems", difficulty: "medium",
  question: "How would you design/implement an LRU Cache?",
  answerEn: "<p>An <b>LRU (Least Recently Used)</b> cache evicts the least recently accessed item when full. Requirements: O(1) get and put.</p><p><b>Design:</b> combine a <b>HashMap</b> (key → node, for O(1) lookup) with a <b>doubly linked list</b> (ordering by recency). On access, move the node to the front; on insert past capacity, evict the tail. In Java, <code class='inline'>LinkedHashMap</code> with <code class='inline'>accessOrder=true</code> gives this out of the box.</p>",
  answerHi: "<p><b>LRU (Least Recently Used)</b> cache full होने पर सबसे कम हाल में इस्तेमाल हुआ item हटाता है। ज़रूरत: O(1) get और put।</p><p><b>Design:</b> <b>HashMap</b> (key → node, O(1) lookup) + <b>doubly linked list</b> (recency order)। Access पर node को front लाओ; capacity पार insert पर tail evict करो। Java में <code class='inline'>LinkedHashMap</code> (<code class='inline'>accessOrder=true</code>) ये सीधे देता है।</p>",
  code: "class LRUCache<K,V> extends LinkedHashMap<K,V> {\n    private final int cap;\n    LRUCache(int cap){ super(cap, 0.75f, true); this.cap = cap; }\n    protected boolean removeEldestEntry(Map.Entry<K,V> e){\n        return size() > cap;\n    }\n}"
},
{
  id: "code-5", category: "Coding Problems", difficulty: "medium",
  question: "Reverse a singly linked list.",
  answerEn: "<p>Iterate through the list, reversing each node's <code class='inline'>next</code> pointer using three references (prev, curr, next). O(n) time, O(1) space. A frequent interview favorite.</p>",
  answerHi: "<p>List पर चलते हुए हर node का <code class='inline'>next</code> pointer उलटो, तीन references (prev, curr, next) से। O(n) time, O(1) space। Interview का common सवाल।</p>",
  code: "Node reverse(Node head) {\n    Node prev = null, curr = head;\n    while (curr != null) {\n        Node next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}"
},

/* ============================ SYSTEM DESIGN (more) ============================ */
{
  id: "sd-4", category: "System Design", difficulty: "hard",
  question: "Design a URL shortener (like bit.ly).",
  answerEn: "<p><b>Requirements:</b> shorten a long URL, redirect fast, handle high read:write ratio, optional analytics.</p><ul><li><b>Encoding:</b> generate a unique ID (auto-increment or a distributed ID like Snowflake), then <b>base62</b> encode it into a short 6–7 char slug.</li><li><b>Storage:</b> key-value store (slug → long URL); reads dominate, so cache hot slugs in <b>Redis</b>.</li><li><b>Redirect:</b> return HTTP 301/302 to the long URL.</li><li><b>Scale:</b> stateless app servers behind a load balancer, DB replication/sharding, CDN. Add rate limiting and expiry.</li></ul>",
  answerHi: "<p><b>Requirements:</b> long URL छोटा करना, तेज़ redirect, बहुत ज़्यादा read:write, optional analytics।</p><ul><li><b>Encoding:</b> unique ID बनाओ (auto-increment या Snowflake जैसा distributed ID), फिर <b>base62</b> encode करके 6–7 char slug।</li><li><b>Storage:</b> key-value (slug → long URL); reads ज़्यादा, इसलिए hot slugs <b>Redis</b> में cache।</li><li><b>Redirect:</b> HTTP 301/302 long URL पर।</li><li><b>Scale:</b> load balancer के पीछे stateless servers, DB replication/sharding, CDN। Rate limiting और expiry जोड़ो।</li></ul>"
},
{
  id: "sd-5", category: "System Design", difficulty: "hard",
  question: "Design a notification service (email/SMS/push).",
  answerEn: "<p><b>Goal:</b> send notifications across channels reliably at scale.</p><ul><li><b>Async core:</b> producers publish events to a <b>message queue</b> (RabbitMQ/Kafka); worker consumers process them — decouples senders from delivery.</li><li><b>Channel adapters:</b> pluggable providers for email (SES), SMS (Twilio), push (FCM).</li><li><b>Reliability:</b> retries with backoff, dead-letter queue for failures, idempotency to avoid duplicate sends.</li><li><b>Features:</b> user preferences/opt-out, templating, rate limiting, priority queues, delivery status tracking.</li></ul>",
  answerHi: "<p><b>लक्ष्य:</b> कई channels पर reliably, scale पर notifications भेजना।</p><ul><li><b>Async core:</b> producers events को <b>message queue</b> (RabbitMQ/Kafka) पर डालें; worker consumers process करें — senders और delivery अलग।</li><li><b>Channel adapters:</b> email (SES), SMS (Twilio), push (FCM) के pluggable providers।</li><li><b>Reliability:</b> backoff के साथ retries, failures के लिए dead-letter queue, duplicate रोकने को idempotency।</li><li><b>Features:</b> user preferences/opt-out, templating, rate limiting, priority queues, delivery status।</li></ul>"
},

/* ============================ BEHAVIORAL (more) ============================ */
{
  id: "beh-8", category: "Behavioral & Leadership", difficulty: "medium",
  question: "Explain your current project's architecture.",
  answerEn: "<p>Structure it top-down and be ready to defend choices:</p><ul><li><b>Overview:</b> what the system does and who uses it (e.g. Bancstac payment platform / Tendable auditing).</li><li><b>Architecture:</b> microservices behind an API gateway, service-to-service via REST + RabbitMQ for async, each with its own DB.</li><li><b>Data & infra:</b> MySQL for transactional data, Redis cache, Elasticsearch for search, Docker + Jenkins CI/CD on AWS.</li><li><b>Cross-cutting:</b> auth (JWT), idempotency, circuit breakers, centralized logging/monitoring.</li></ul><p>Then mention a key trade-off you made and why.</p>",
  answerHi: "<p>Top-down बताओ और choices defend करने को तैयार रहो:</p><ul><li><b>Overview:</b> system क्या करता है और कौन use करता है (जैसे Bancstac / Tendable)।</li><li><b>Architecture:</b> API gateway के पीछे microservices, REST + async के लिए RabbitMQ, हर एक का अपना DB।</li><li><b>Data & infra:</b> transactional data के लिए MySQL, Redis cache, search के लिए Elasticsearch, AWS पर Docker + Jenkins CI/CD।</li><li><b>Cross-cutting:</b> auth (JWT), idempotency, circuit breakers, centralized logging/monitoring।</li></ul><p>फिर एक अहम trade-off और उसकी वजह बताओ।</p>"
},
{
  id: "beh-9", category: "Behavioral & Leadership", difficulty: "medium",
  question: "Describe a time you optimized application performance.",
  answerEn: "<p>Use STAR and lead with a metric:</p><ul><li><b>S/T:</b> \"Payment-gateway latency spiked under load.\"</li><li><b>A:</b> \"I profiled it, found N+1 queries and synchronous external calls; added proper indexes and JOIN FETCH, moved non-critical work to RabbitMQ, and cached hot lookups in Redis.\"</li><li><b>R:</b> \"Cut latency ~20% and stabilized peak throughput.\"</li></ul><p>Emphasize that you <b>measured before and after</b> — optimization without data is guessing.</p>",
  answerHi: "<p>STAR use करो और metric से शुरू करो:</p><ul><li><b>S/T:</b> \"Load पर payment-gateway latency बढ़ रही थी।\"</li><li><b>A:</b> \"Profile किया, N+1 queries और synchronous external calls मिले; indexes + JOIN FETCH लगाए, non-critical काम RabbitMQ पर डाला, hot lookups Redis में cache किए।\"</li><li><b>R:</b> \"Latency ~20% घटी और peak throughput stable हुआ।\"</li></ul><p>ज़ोर दो कि आपने <b>पहले और बाद में measure</b> किया — बिना data optimization सिर्फ़ अंदाज़ा है।</p>"
},
{
  id: "beh-10", category: "Behavioral & Leadership", difficulty: "easy",
  question: "How do you ensure code quality and maintainability?",
  answerEn: "<ul><li><b>Reviews:</b> mandatory PR reviews with clear standards; I use AI-assisted review to catch issues before human review.</li><li><b>Tests:</b> unit (JUnit/Mockito) + integration tests, meaningful coverage on critical paths.</li><li><b>Automation:</b> CI pipeline running build, tests, static analysis/linting on every PR.</li><li><b>Design:</b> clean layering, SOLID, small focused commits, and documentation for non-obvious decisions.</li></ul>",
  answerHi: "<ul><li><b>Reviews:</b> clear standards के साथ ज़रूरी PR reviews; human review से पहले AI-assisted review से issues पकड़ता हूँ।</li><li><b>Tests:</b> unit (JUnit/Mockito) + integration tests, critical paths पर meaningful coverage।</li><li><b>Automation:</b> हर PR पर build, tests, static analysis/linting वाला CI pipeline।</li><li><b>Design:</b> clean layering, SOLID, छोटे focused commits, non-obvious decisions की documentation।</li></ul>"
},
{
  id: "beh-11", category: "Behavioral & Leadership", difficulty: "medium",
  question: "Describe a production deployment or rollback you handled.",
  answerEn: "<p>Show a safe, controlled release process:</p><ul><li><b>Safe deploys:</b> CI/CD via Jenkins, staged rollout (canary/blue-green), feature flags, and health checks after deploy.</li><li><b>When something broke:</b> \"Post-deploy error rate spiked; I rolled back to the last stable version immediately (or flipped the feature flag off), restored service, then root-caused calmly.\"</li><li><b>Follow-up:</b> added a regression test and monitoring/alert so it can't silently recur; ran a blameless retro.</li></ul>",
  answerHi: "<p>एक safe, controlled release process दिखाओ:</p><ul><li><b>Safe deploys:</b> Jenkins CI/CD, staged rollout (canary/blue-green), feature flags, deploy के बाद health checks।</li><li><b>जब कुछ टूटा:</b> \"Deploy के बाद error rate बढ़ी; मैंने तुरंत last stable version पर rollback किया (या feature flag off), service बहाल की, फिर आराम से root-cause किया।\"</li><li><b>Follow-up:</b> regression test और monitoring/alert जोड़ा ताकि दोबारा चुपचाप न हो; blameless retro किया।</li></ul>"
},

/* ============================ OUTPUT & DEBUGGING (predict the output / find the mistake) ============================ */
{
  id: "out-1", category: "Output & Debugging", difficulty: "easy",
  question: "String compare: what does this print and why?",
  codeTop: "String a = \"hello\";\nString b = \"hello\";\nString c = new String(\"hello\");\n\nSystem.out.println(a == b);      // ?\nSystem.out.println(a == c);      // ?\nSystem.out.println(a.equals(c)); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>true</code>, <code class='inline'>false</code>, <code class='inline'>true</code>.</p><p><b>Why:</b> <code class='inline'>a</code> and <code class='inline'>b</code> are string <b>literals</b> — they point to the <b>same</b> object in the string pool, so <code class='inline'>==</code> is true. <code class='inline'>new String(\"hello\")</code> forces a <b>new object on the heap</b>, so <code class='inline'>a == c</code> is false. <code class='inline'>equals()</code> compares <b>content</b>, so it's true.</p><p><b>Mistake:</b> using <code class='inline'>==</code> to compare String content. Always use <code class='inline'>equals()</code> for value comparison.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>true</code>, <code class='inline'>false</code>, <code class='inline'>true</code>।</p><p><b>क्यों:</b> <code class='inline'>a</code> और <code class='inline'>b</code> <b>literals</b> हैं — string pool में <b>एक ही</b> object की ओर, इसलिए <code class='inline'>==</code> true। <code class='inline'>new String(\"hello\")</code> heap पर <b>नया object</b> बनाता है, इसलिए <code class='inline'>a == c</code> false। <code class='inline'>equals()</code> <b>content</b> compare करता है, इसलिए true।</p><p><b>गलती:</b> String content को <code class='inline'>==</code> से compare करना। Value के लिए हमेशा <code class='inline'>equals()</code>।</p>"
},
{
  id: "out-2", category: "Output & Debugging", difficulty: "medium",
  question: "Integer caching: why do these two comparisons differ?",
  codeTop: "Integer a = 127, b = 127;\nInteger c = 128, d = 128;\n\nSystem.out.println(a == b); // ?\nSystem.out.println(c == d); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>true</code>, then <code class='inline'>false</code>.</p><p><b>Why:</b> Java caches <code class='inline'>Integer</code> objects in the range <b>-128 to 127</b> (Integer pool). So <code class='inline'>a</code> and <code class='inline'>b</code> are the same cached object → <code class='inline'>==</code> true. 128 is outside the cache, so <code class='inline'>c</code> and <code class='inline'>d</code> are different objects → <code class='inline'>==</code> false.</p><p><b>Mistake:</b> comparing wrapper objects with <code class='inline'>==</code>. Use <code class='inline'>.equals()</code> or unbox to <code class='inline'>int</code> first.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>true</code>, फिर <code class='inline'>false</code>।</p><p><b>क्यों:</b> Java <code class='inline'>Integer</code> objects को <b>-128 से 127</b> range में cache करता है। इसलिए <code class='inline'>a</code> और <code class='inline'>b</code> same cached object → <code class='inline'>==</code> true। 128 cache के बाहर है, इसलिए <code class='inline'>c</code>, <code class='inline'>d</code> अलग objects → <code class='inline'>==</code> false।</p><p><b>गलती:</b> wrapper objects को <code class='inline'>==</code> से compare करना। <code class='inline'>.equals()</code> use करो या पहले <code class='inline'>int</code> में unbox करो।</p>"
},
{
  id: "out-3", category: "Output & Debugging", difficulty: "easy",
  question: "String immutability: what is printed?",
  codeTop: "String s = \"Java\";\ns.concat(\" Rocks\");\nSystem.out.println(s); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>Java</code></p><p><b>Why:</b> Strings are <b>immutable</b>. <code class='inline'>concat()</code> returns a <b>new</b> String and does not modify <code class='inline'>s</code>. Since the return value is ignored, the original is unchanged.</p><p><b>Fix:</b> <code class='inline'>s = s.concat(\" Rocks\");</code> — you must assign the result.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>Java</code></p><p><b>क्यों:</b> Strings <b>immutable</b> हैं। <code class='inline'>concat()</code> एक <b>नया</b> String लौटाता है, <code class='inline'>s</code> को बदलता नहीं। Return value ignore हुई इसलिए original वैसा ही।</p><p><b>Fix:</b> <code class='inline'>s = s.concat(\" Rocks\");</code> — result assign करना ज़रूरी है।</p>"
},
{
  id: "out-4", category: "Output & Debugging", difficulty: "easy",
  question: "Parent reference, Child object — which method runs?",
  codeTop: "class Parent { void show(){ System.out.println(\"Parent\"); } }\nclass Child extends Parent { void show(){ System.out.println(\"Child\"); } }\n\nParent p = new Child();\np.show(); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>Child</code></p><p><b>Why:</b> Instance methods use <b>runtime (dynamic) dispatch</b> — the method that runs is decided by the <b>actual object type</b> (Child), not the reference type (Parent). This is polymorphism / method overriding.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>Child</code></p><p><b>क्यों:</b> Instance methods <b>runtime (dynamic) dispatch</b> use करते हैं — कौन-सा method चलेगा ये <b>असली object type</b> (Child) से तय होता है, reference type (Parent) से नहीं। यही polymorphism / overriding है।</p>"
},
{
  id: "out-5", category: "Output & Debugging", difficulty: "hard",
  question: "Field hiding vs method overriding — the classic trap.",
  codeTop: "class Parent { int x = 10; int get(){ return x; } }\nclass Child extends Parent { int x = 20; int get(){ return x; } }\n\nParent p = new Child();\nSystem.out.println(p.x);     // ?\nSystem.out.println(p.get()); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>10</code>, then <code class='inline'>20</code>.</p><p><b>Why:</b> <b>Fields are NOT polymorphic</b> — <code class='inline'>p.x</code> is resolved by the <b>reference type</b> (Parent) at compile time → 10. <b>Methods ARE polymorphic</b> — <code class='inline'>p.get()</code> runs Child's version (actual object) → returns Child's x = 20.</p><p><b>Takeaway:</b> never rely on field access through a superclass reference; only methods are overridden.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>10</code>, फिर <code class='inline'>20</code>।</p><p><b>क्यों:</b> <b>Fields polymorphic नहीं</b> — <code class='inline'>p.x</code> <b>reference type</b> (Parent) से compile time पर resolve → 10। <b>Methods polymorphic हैं</b> — <code class='inline'>p.get()</code> Child का version चलाता है → Child का x = 20।</p><p><b>सीख:</b> superclass reference से field access पर भरोसा मत करो; सिर्फ़ methods override होते हैं।</p>"
},
{
  id: "out-6", category: "Output & Debugging", difficulty: "medium",
  question: "Static methods and inheritance — what prints?",
  codeTop: "class Parent { static void hi(){ System.out.println(\"Parent\"); } }\nclass Child extends Parent { static void hi(){ System.out.println(\"Child\"); } }\n\nParent p = new Child();\np.hi(); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>Parent</code></p><p><b>Why:</b> Static methods are <b>hidden, not overridden</b>. They're bound at <b>compile time</b> by the <b>reference type</b> (Parent), not the object. Calling a static method through an instance reference is misleading.</p><p><b>Mistake:</b> expecting polymorphism on static methods. Call them via the class name: <code class='inline'>Parent.hi()</code>.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>Parent</code></p><p><b>क्यों:</b> Static methods <b>hidden होते हैं, overridden नहीं</b>। ये <b>compile time</b> पर <b>reference type</b> (Parent) से bind होते हैं, object से नहीं। Instance reference से static call भ्रामक है।</p><p><b>गलती:</b> static methods पर polymorphism की उम्मीद। इन्हें class name से call करो: <code class='inline'>Parent.hi()</code>।</p>"
},
{
  id: "out-7", category: "Output & Debugging", difficulty: "medium",
  question: "Casting Parent to Child — what happens?",
  codeTop: "Parent p = new Parent();\nChild c = (Child) p; // ?",
  answerEn: "<p><b>Output:</b> <b>ClassCastException</b> at runtime.</p><p><b>Why:</b> <code class='inline'>p</code> refers to a real <b>Parent</b> object, which is not a Child. Downcasting is only legal if the object <b>actually is</b> a Child (e.g. created as <code class='inline'>Parent p = new Child()</code>). The compiler allows the cast, but the JVM checks the real type and throws.</p><p><b>Fix:</b> guard with <code class='inline'>if (p instanceof Child c) { ... }</code> before casting.</p>",
  answerHi: "<p><b>Output:</b> runtime पर <b>ClassCastException</b>।</p><p><b>क्यों:</b> <code class='inline'>p</code> असल में <b>Parent</b> object है, जो Child नहीं है। Downcasting तभी valid जब object <b>सच में</b> Child हो (जैसे <code class='inline'>Parent p = new Child()</code>)। Compiler cast allow करता है, पर JVM असली type check करके exception फेंकता है।</p><p><b>Fix:</b> cast से पहले <code class='inline'>if (p instanceof Child c) { ... }</code> से guard करो।</p>"
},
{
  id: "out-8", category: "Output & Debugging", difficulty: "medium",
  question: "Why won't this compile? (upcasting + child-only method)",
  codeTop: "class Parent { void common(){} }\nclass Child extends Parent { void childOnly(){} }\n\nParent p = new Child();\np.childOnly(); // compile error?",
  answerEn: "<p><b>Result:</b> <b>Compile error</b> — 'cannot find symbol childOnly'.</p><p><b>Why:</b> The <b>reference type</b> is <code class='inline'>Parent</code>, and the compiler only allows methods declared in <code class='inline'>Parent</code> (or its supertypes). Even though the object is a Child, the compiler doesn't know that.</p><p><b>Fix:</b> downcast after checking: <code class='inline'>if (p instanceof Child ch) ch.childOnly();</code></p>",
  answerHi: "<p><b>Result:</b> <b>Compile error</b> — 'cannot find symbol childOnly'।</p><p><b>क्यों:</b> <b>Reference type</b> <code class='inline'>Parent</code> है, और compiler सिर्फ़ <code class='inline'>Parent</code> (या उसके supertypes) में declared methods allow करता है। Object भले Child हो, compiler को पता नहीं।</p><p><b>Fix:</b> check करके downcast: <code class='inline'>if (p instanceof Child ch) ch.childOnly();</code></p>"
},
{
  id: "out-9", category: "Output & Debugging", difficulty: "hard",
  question: "HashSet with a custom object — why does contains() fail?",
  codeTop: "class Point { int x, y;\n    Point(int x, int y){ this.x = x; this.y = y; }\n}\nSet<Point> set = new HashSet<>();\nset.add(new Point(1, 2));\nSystem.out.println(set.contains(new Point(1, 2))); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>false</code></p><p><b>Why:</b> <code class='inline'>Point</code> doesn't override <code class='inline'>equals()</code> and <code class='inline'>hashCode()</code>, so it uses <b>Object identity</b>. The two <code class='inline'>new Point(1,2)</code> are different objects with different hashes, so the set can't find a match.</p><p><b>Fix:</b> override both <code class='inline'>equals()</code> and <code class='inline'>hashCode()</code> based on x and y (or use a <code class='inline'>record</code>).</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>false</code></p><p><b>क्यों:</b> <code class='inline'>Point</code> ने <code class='inline'>equals()</code> और <code class='inline'>hashCode()</code> override नहीं किए, इसलिए <b>Object identity</b> use होती है। दोनों <code class='inline'>new Point(1,2)</code> अलग objects हैं जिनके hash अलग हैं, इसलिए set match नहीं ढूँढ पाता।</p><p><b>Fix:</b> x और y के आधार पर <code class='inline'>equals()</code> + <code class='inline'>hashCode()</code> दोनों override करो (या <code class='inline'>record</code> use करो)।</p>"
},
{
  id: "out-10", category: "Output & Debugging", difficulty: "medium",
  question: "Memory & references: what does a[0] print?",
  codeTop: "int[] a = {1, 2, 3};\nint[] b = a;      // reference copy, not a new array\nb[0] = 99;\nSystem.out.println(a[0]); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>99</code></p><p><b>Why:</b> Arrays and objects are <b>references</b>. <code class='inline'>b = a</code> copies the <b>reference</b>, not the data — both point to the <b>same</b> array on the heap. Changing <code class='inline'>b[0]</code> changes what <code class='inline'>a</code> sees too (aliasing).</p><p><b>Note:</b> primitives (<code class='inline'>int</code>) copy by value; objects/arrays copy by reference. To get an independent copy use <code class='inline'>a.clone()</code> or <code class='inline'>Arrays.copyOf</code>.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>99</code></p><p><b>क्यों:</b> Arrays और objects <b>references</b> होते हैं। <code class='inline'>b = a</code> <b>reference</b> copy करता है, data नहीं — दोनों heap पर <b>एक ही</b> array की ओर। <code class='inline'>b[0]</code> बदलने पर <code class='inline'>a</code> में भी बदलता है (aliasing)।</p><p><b>ध्यान:</b> primitives (<code class='inline'>int</code>) value से copy होते हैं; objects/arrays reference से। Independent copy के लिए <code class='inline'>a.clone()</code> या <code class='inline'>Arrays.copyOf</code>।</p>"
},
{
  id: "out-11", category: "Output & Debugging", difficulty: "medium",
  question: "try/finally with return — what is returned?",
  codeTop: "int m() {\n    try {\n        return 1;\n    } finally {\n        return 2;\n    }\n}\n// System.out.println(m());  // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>2</code></p><p><b>Why:</b> <code class='inline'>finally</code> always runs, and a <code class='inline'>return</code> inside <code class='inline'>finally</code> <b>overrides</b> the one in <code class='inline'>try</code> — it also silently swallows any pending exception.</p><p><b>Mistake:</b> returning (or throwing) from <code class='inline'>finally</code>. Use finally only for cleanup, never for control flow.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>2</code></p><p><b>क्यों:</b> <code class='inline'>finally</code> हमेशा चलता है, और <code class='inline'>finally</code> के अंदर का <code class='inline'>return</code> <code class='inline'>try</code> वाले को <b>override</b> कर देता है — साथ ही किसी pending exception को भी चुपचाप निगल जाता है।</p><p><b>गलती:</b> <code class='inline'>finally</code> से return/throw करना। finally सिर्फ़ cleanup के लिए, control flow के लिए कभी नहीं।</p>"
},
{
  id: "out-12", category: "Output & Debugging", difficulty: "medium",
  question: "Autoboxing NullPointerException — spot the bug.",
  codeTop: "Map<String, Integer> m = new HashMap<>();\nint count = m.get(\"missing\"); // ?",
  answerEn: "<p><b>Output:</b> <b>NullPointerException</b>.</p><p><b>Why:</b> <code class='inline'>get()</code> returns <code class='inline'>null</code> for a missing key. Assigning a <code class='inline'>null</code> Integer to a primitive <code class='inline'>int</code> triggers <b>auto-unboxing</b> (<code class='inline'>null.intValue()</code>) → NPE.</p><p><b>Fix:</b> use <code class='inline'>m.getOrDefault(\"missing\", 0)</code> or keep it as <code class='inline'>Integer</code> and null-check.</p>",
  answerHi: "<p><b>Output:</b> <b>NullPointerException</b>।</p><p><b>क्यों:</b> missing key पर <code class='inline'>get()</code> <code class='inline'>null</code> लौटाता है। <code class='inline'>null</code> Integer को primitive <code class='inline'>int</code> में डालने पर <b>auto-unboxing</b> (<code class='inline'>null.intValue()</code>) → NPE।</p><p><b>Fix:</b> <code class='inline'>m.getOrDefault(\"missing\", 0)</code> use करो या <code class='inline'>Integer</code> रखकर null-check करो।</p>"
},
{
  id: "out-13", category: "Output & Debugging", difficulty: "hard",
  question: "Constructor calls an overridden method — what is x?",
  codeTop: "class Parent {\n    Parent(){ init(); }\n    void init(){ System.out.println(\"Parent init\"); }\n}\nclass Child extends Parent {\n    int x = 5;\n    void init(){ System.out.println(\"Child init, x = \" + x); }\n}\nnew Child();",
  answerEn: "<p><b>Output:</b> <code class='inline'>Child init, x = 0</code></p><p><b>Why:</b> Construction runs the <b>Parent constructor first</b>, which calls <code class='inline'>init()</code>. Due to polymorphism, <b>Child's</b> <code class='inline'>init()</code> runs — but at that moment Child's fields aren't initialized yet, so <code class='inline'>x</code> is still its default <code class='inline'>0</code> (it becomes 5 only after the Parent constructor returns).</p><p><b>Mistake:</b> calling overridable methods from a constructor. Avoid it — the subclass isn't fully built yet.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>Child init, x = 0</code></p><p><b>क्यों:</b> Object बनते समय पहले <b>Parent constructor</b> चलता है, जो <code class='inline'>init()</code> call करता है। Polymorphism से <b>Child</b> का <code class='inline'>init()</code> चलता है — पर उस वक़्त Child के fields initialize नहीं हुए, इसलिए <code class='inline'>x</code> अभी default <code class='inline'>0</code> है (Parent constructor खत्म होने के बाद ही 5 बनता है)।</p><p><b>गलती:</b> constructor से overridable method call करना। इससे बचो — subclass अभी पूरा बना नहीं है।</p>"
},
{
  id: "out-14", category: "Output & Debugging", difficulty: "easy",
  question: "Floating-point: why is 0.1 + 0.2 == 0.3 false?",
  codeTop: "System.out.println(0.1 + 0.2);        // ?\nSystem.out.println(0.1 + 0.2 == 0.3); // ?",
  answerEn: "<p><b>Output:</b> <code class='inline'>0.30000000000000004</code>, then <code class='inline'>false</code>.</p><p><b>Why:</b> <code class='inline'>double</code>/<code class='inline'>float</code> use binary floating point (IEEE 754) which <b>can't represent</b> decimals like 0.1 exactly, so tiny rounding errors accumulate.</p><p><b>Fix:</b> for money/precision use <code class='inline'>BigDecimal</code> (constructed from a String), or compare with a small epsilon tolerance.</p>",
  answerHi: "<p><b>Output:</b> <code class='inline'>0.30000000000000004</code>, फिर <code class='inline'>false</code>।</p><p><b>क्यों:</b> <code class='inline'>double</code>/<code class='inline'>float</code> binary floating point (IEEE 754) use करते हैं जो 0.1 जैसे decimals को <b>exactly represent नहीं</b> कर सकते, इसलिए छोटे rounding errors जमा होते हैं।</p><p><b>Fix:</b> money/precision के लिए <code class='inline'>BigDecimal</code> (String से बनाओ), या छोटी epsilon tolerance से compare करो।</p>"
}

];
