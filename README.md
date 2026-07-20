# Mani Ratan Singh — Personal Website & Digital Archive

This repository houses the source code and content for my personal website: [mrps.in](https://mrps.in). It serves as my personal directory, engineering logbook, photography archive, and digital home on the web.

---

## 🎨 Design Philosophy

*   **Simplicity is Identity:** Built entirely without bulky frameworks (like React, Astro, or Tailwind). It uses vanilla HTML, custom fluid CSS, and compiles via a lightweight Pandoc pipeline.
*   **Performance First:** Zero client-side JS trackers, zero database queries, and static asset streaming directly from the edge CDN.
*   **Dual Interfaces:** Serves human-friendly reading layouts alongside machine-readable index streams (`robots.txt`, `llms.txt`, and `sitemap.xml`) to allow easy consumption by both humans and AI crawlers.

---

## 📂 Site Structure & Contents

*   **[Home (Biography)](/content/index.md):** Main entry point, biography, and profile directories.
*   **[Projects](/content/projects/):** Technical write-ups and schematics synced directly from active GitHub repositories (GPS Clock, Smart Matrix Matrix Clock, Water Tank Monitor, RP2040 Macropad, and more).
*   **[Posts (Blog)](/content/blog/):** Unfiltered thoughts on hardware engineering, software simplification, and web architecture.
*   **[Photos](/content/photos/):** Portfolio links for photography galleries, night exposures, and visual experiments.

---

## ⚡ Deployment & Infrastructure

The site is hosted on **Cloudflare Pages** and builds automatically on every commit to the main branch. 

*   **Compilation Engine:** Driven by `build.sh` (converts Markdown to static HTML using Pandoc and auto-generates sitemaps and LLM manifest files).
*   **Local Documentation:** Technical development guidelines, file layouts, and syncing routines are kept internally inside `ARCHITECTURE.md` and `INSTRUCTION.md`.

---

## 📄 License
MIT © [Mani Ratan Singh](https://mrps.in)
