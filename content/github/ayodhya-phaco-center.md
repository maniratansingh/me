---
title: "Ayodhya Phaco Center Website"
description: "Repository for the official website of the Ayodhya Phaco Center."
section: github
---

## Philosophy & Architecture Decisions
Medical information pages must be accessible, lightweight, and load instantly even under poor rural network conditions (such as 3G/low-speed connections). The website's architecture completely bypasses heavy single-page application (SPA) frameworks or runtime systems. By relying on pure semantic HTML structure and highly optimized styles, the site guarantees an ultra-fast Time-to-Interactive (TTI).

## Technical Details
- **Tech Stack:** Vanilla HTML5 and CSS3 (compiled directly without client-side JavaScript packages).
- **Accessibility:** Uses semantic layout tags (`<header>`, `<main>`, `<nav>`, `<article>`) to satisfy screen reader devices and accessibility guidelines.
- **Performance:** Replaces raw asset dependencies with optimized image formats (WebP) and inline SVGs to reduce HTTP server requests.
- **Responsive Layout:** Responsive layout driven by CSS grid systems that automatically collapse to single columns on small smartphone displays.

## Code Link
- [View ayodhya-phaco-center on GitHub](https://github.com/maniratansingh/ayodhya-phaco-center) ↗

---
← [Back to GitHub Projects](/github/)
