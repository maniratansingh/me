---
title: "Jellyfin Liquid Glass Theme"
description: "A custom user interface theme for Jellyfin Media Server utilizing CSS variables and glassmorphism styling."
section: github
---

## Philosophy & Architecture Decisions
A media server theme should be visual and fluid without impacting the host server or client playback performance. While JavaScript plugins can modify structural interfaces, they introduce rendering delays. By utilizing pure CSS overrides, this theme processes modifications entirely on the GPU. It turns the stock Jellyfin layout into a translucent, modern design that scales smoothly to high-refresh-rate displays.

## Technical Details
- **Styling Architecture:** Built using CSS custom properties (`--variables`) to override default theme configurations.
- **Visual Effects:** Implements hardware-accelerated `backdrop-filter: blur()` properties to achieve real-time glassmorphism transparency over background media art.
- **Optimization:** Avoids DOM manipulation or heavy layout shifts, preserving 60fps rendering speeds across desktop, mobile, and smart TV browsers.
- **Layout Adjustments:** Modernizes the library poster grids, sidebars, and control overlays with softer shadows and custom transition timings.

## Code Link
- [View jellyfin-liquid-glass repository on GitHub](https://github.com/maniratansingh/jellyfin-liquid-glass) ↗

---
← [Back to GitHub Projects](/github/)
