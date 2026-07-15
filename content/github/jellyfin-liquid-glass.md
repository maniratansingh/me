---
title: "Jellyfin Liquid Glass Theme"
description: "A modern glassmorphism custom stylesheet for Jellyfin web client and desktop players."
section: github
---

## Philosophy & Architecture Decisions
A custom theme should modernize user interface design without compromising video playback or navigation performance. By avoiding JavaScript DOM scripts, this theme operates as a pure CSS injection. Layout overrides and visual rendering modifications run directly on GPU client hardware to preserve responsive 60fps interaction speeds.

## Comprehensive UI Enhancements
1. **Frosted Glass UI:** Replaces blocky solid dark boxes with translucent frosted layers utilizing `backdrop-filter: blur(x)` values. This is applied to navigation drawers, sidebars, context action menus, and mobile bottom bars.
2. **Floating Video Player Pills:** Controls are styled as floating rounded pill elements at 10% opacity, preventing overlapping glass layers and keeping the media playing behind the dashboard interface clearly visible.
3. **Mobile Optimizations:**
   - Drops `backdrop-filter` on mobile players to ensure instant responsiveness.
   - Resizes titles and adjusts media cards to prevent content truncation.
   - Implements CSS transitions to smoothly scale control overlays when rotating screen orientation between portrait and landscape.
4. **Login Freeze Fix:** Resolves WebKit rendering bugs on Safari/iPhones by removing conflicting GPU hardware acceleration attributes (`translateZ(0)` and `isolation`) on text fields.

## How to Apply

Add the following CDN imports under **Jellyfin Dashboard -> General -> Custom CSS code**:

### Desktop & Mobile
```css
@import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@main/liquid-glass-bundle.css");
```

### Android TV & Fire TV (Optimized for D-Pad controllers)
```css
@import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@main/liquid-glass-tv.css");
```

## Code Link
- [View jellyfin-liquid-glass on GitHub](https://github.com/maniratansingh/jellyfin-liquid-glass) ↗

---
← [Back to GitHub Projects](/github/)
