---
title: "Jellyfin Liquid Glass Theme"
description: "A custom user interface theme for Jellyfin Media Server utilizing CSS variables and glassmorphism styling."
section: github
---

## Philosophy & Architecture Decisions
A media server theme should be visual and fluid without impacting the host server or client playback performance. While JavaScript plugins can modify structural interfaces, they introduce rendering delays. By utilizing pure CSS overrides, this theme processes modifications entirely on the GPU. It turns the stock Jellyfin layout into a translucent, modern design that scales smoothly to high-refresh-rate displays.

---

## Visual Design Enhancements

### 1. Frosted Glass UI (Backdrop Filters)
Replaces solid dark backgrounds with translucent frosted glass styling using `backdrop-filter: blur(x)` rules. This is applied to:
- The main sidebar navigation panel.
- System pop-up dialog boxes.
- User profile configuration drawers.
- Action menus and mobile bottom navigation bars.

### 2. Floating Video Player Control Pills
- **Pill-Shaped Layout:** Restyles the top navigation bar (back buttons, titles, control indicators) and the bottom control panel (seek bar, volume slider, configuration toggles) into floating rounded pill elements instead of full-width blocks.
- **Glass Transparency:** The control pills use 10% opacity, matching the play/pause button layout for a uniform visual flow. The media behind the controls remains visible.
- **Zero Double-Overlays:** The base parent container for the player controls is forced to be transparent. This prevents stacked glass layers, which would make the controls look opaque.
- **Access to Native Elements:** Preserves button visibility for Play/Pause, Rewind, Fast Forward, Volume controls, Settings, Subtitle configuration, Fullscreen, Favorites, Track skipping, casting, and SyncPlay.

---

## Platform-Specific Optimizations

### Mobile Devices (Safari / Android WebKit / iOS Apps)
- **Clear Glass Styling:** Disables `backdrop-filter` blur on mobile players to ensure instant responsiveness.
- **Dynamic Text Scaling:** Decreases title font sizes on mobile displays to prevent longer titles from being cut off.
- **Poster Sizing:** Adjusts the width of media layout cards to optimize mobile screen space.
- **Rotational Transitions:** Implements a 0.5-second CSS transition animation. When screen orientation is rotated between portrait and landscape modes, the player controls scale smoothly rather than snapping instantly.
- **Input Freeze Patch:** Resolves a known WebKit bug that causes text fields to ignore input on iPhones by removing conflicting GPU hardware acceleration attributes (`translateZ(0)` and `isolation`) from login fields.

### Smart TV Client Optimization
Jellyfin's TV client has a completely different layout from the mobile/desktop app. It is built for a **10-foot interface** (large text/buttons read from a distance) and navigated using a **D-pad TV remote** (requiring clear glowing focus indicator styles when selecting buttons). Using the mobile CSS on a TV would break D-pad navigation and ruin the TV layout, so the styles are separated to keep TV functionality working perfectly.

---

## Installation & Deployment Instructions

To apply these styles, copy and paste the CDN import directives into **Jellyfin Dashboard -> General -> Custom CSS code**:

### Desktop, Browser, and Mobile Clients
```css
@import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@main/liquid-glass-bundle.css");
```

### Android TV & Fire TV (Optimized for remote controllers)
```css
@import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@main/liquid-glass-tv.css");
```

---

## Force Updating Styles (CDN Caching)
CDNs and web browsers cache CSS stylesheets aggressively. When styles are updated on GitHub, clients may continue loading cached versions. To bypass the cache and force client updates immediately, append a version query parameter (`?v=number`) to the CDN link:

```css
@import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@main/liquid-glass-bundle.css?v=2");
```
Simply increment the version parameter (e.g. `?v=3`) whenever new style updates are pushed to force client browsers to download the fresh stylesheet.

## Code Link
- [View jellyfin-liquid-glass on GitHub](https://github.com/maniratansingh/jellyfin-liquid-glass) ↗

---
← [Back to GitHub Projects](/github/)
