---
title: "Ayodhya Phaco Center Website"
description: "The official static website repository for the Ayodhya Phaco Center eye clinic."
section: github
---

## Philosophy & Architecture Decisions
Medical information websites must be accessible, reliable, and load instantly even under poor network conditions (such as rural 3G environments). Modern single-page application (SPA) frameworks compile into large JavaScript bundles, delaying page interactivity on low-powered devices. 

By utilizing static HTML and vanilla CSS, the site ensures page layouts are available immediately. This structure reduces data usage, satisfies search engine scrapers, and ensures accessibility tools function correctly.

---

## Key Interface & Performance Features

### 1. Frosted Glass UI Layout
The website incorporates a modern layout inspired by glassmorphism design:
- Uses subtle frosted glass panels (`backdrop-filter: blur(12px)`) to construct header bars, info sections, and navigation panels.
- Retains a clean dark-background feel while overlaying semi-translucent containers over backdrops.

### 2. Form Visibility & Readability Optimization
Online patient scheduling and appointment booking interfaces require high visual contrast:
- The opacity levels of contact boxes and appointment forms are optimized.
- The styling guarantees text is legible under bright sunlight on small mobile screens.
- Avoids layered opacity conflicts to keep form validation states readable.

### 3. Mobile Fluidity & Accessibility
- **CSS Grid Integration:** Uses responsive layouts that automatically scale column counts based on viewport width. The design adapts from narrow smartphone viewports to wide desktop monitors.
- **Semantic HTML Markup:** Built using standard landmark tags (`<header>`, `<main>`, `<nav>`, `<article>`) to satisfy screen-reader compliance.
- **Zero Render-Blocking Scripts:** Eliminates third-party trackers, large fonts, and render-blocking libraries to ensure fast load times.
- **Print Layout Support:** Includes print-specific CSS rules. This formats appointment confirmations and address details for standard physical paper sizing if patients print instructions.

## Code Link
- [View ayodhya-phaco-center on GitHub](https://github.com/maniratansingh/ayodhya-phaco-center) ↗

---
← [Back to GitHub Projects](/github/)
