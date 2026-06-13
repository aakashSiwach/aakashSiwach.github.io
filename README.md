# Aakash Siwach — Portfolio

Animated, SEO-optimized personal portfolio built with **vanilla HTML, CSS & JavaScript** — no build step, no framework. Deployed on **GitHub Pages** at <https://aakashsiwach.github.io/>.

## ✨ Features

- **Animation** — particle-network canvas background, hero typing effect, scroll-reveal, animated counters & skill bars, shimmer gradients.
- **Technical** — semantic HTML, accessible markup, `prefers-reduced-motion` support, theme toggle (dark/light, persisted), mobile nav, scroll-progress bar.
- **SEO** — full meta tags, Open Graph + Twitter cards, JSON-LD `Person` structured data, `sitemap.xml`, `robots.txt`, canonical URL, web manifest, OG cover image.
- **Reach companies** — "Open to opportunities" badge, prominent **Hire me** CTA, one-click **Download CV** (print-to-PDF), and a no-backend contact form (`mailto:`).
- **Games & fun** — three hand-built games + easter eggs:
  - 🐞 **Bug Squasher** — 30s reaction game (golden bugs = +5).
  - ⌨️ **Code Typing Speed Test** — WPM + accuracy on real code snippets.
  - 🃏 **Tech Memory Match** — flip-card matching of tech logos.
  - Hidden **terminal** (press `~`, type `help`) and the **Konami code** (`↑↑↓↓←→←→BA`) confetti.
- **Live project** — links to [neweraworldschool.in](https://neweraworldschool.in/), which Aakash builds & maintains.

## 📂 Structure

```
.
├── index.html              # main single-page portfolio
├── 404.html                # custom not-found page
├── robots.txt              # crawler rules
├── sitemap.xml             # search-engine sitemap
├── site.webmanifest        # PWA / install metadata
├── .nojekyll               # serve assets/ untouched on Pages
└── assets/
    ├── css/style.css       # all styling + design tokens
    ├── js/main.js          # animations, nav, theme, terminal, easter eggs
    ├── js/games.js         # the three mini-games
    ├── img/og-cover.jpg    # social share image (1200x630)
    └── img/profile.jpg     # hero / structured-data photo
```

## 🚀 Deploy

Pushing to `main` triggers the GitHub Actions Pages workflow. No build needed — static files are served as-is.

To run locally, just open `index.html`, or serve the folder:

```bash
python -m http.server 8080   # then visit http://localhost:8080
```

## 🔧 Updating content

All copy lives in `index.html`. Update the JSON-LD block and `<meta>` tags if your title/role changes, and bump `<lastmod>` in `sitemap.xml`.
