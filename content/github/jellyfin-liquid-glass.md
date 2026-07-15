---
title: "Jellyfin Liquid Glass Theme"
description: "A modern glassmorphism custom stylesheet for Jellyfin web client and desktop players."
section: github
---

# Jellyfin Liquid Glass Theme

> **Note:** This is a personal CSS theme I use for my own Jellyfin server. I am sharing it in case someone else finds it useful, but it is provided as-is. It is highly experimental and might break when Jellyfin updates.

## Credits

This is a direct modification of the **Abyss Jellyfin Theme** by **AumGupta**. I used their work as the foundation and modified it heavily to fit my own needs. Full credit goes to them for the original theme.
Source: https://github.com/AumGupta/abyss-jellyfin

## Comprehensive Explanation of Changes

If you add this CSS to your Jellyfin server, here is a comprehensive list of exactly what it changes compared to the stock Jellyfin UI:

### 1. Frosted Glass UI (Backdrop Filters)

- Replaces solid dark backgrounds with translucent frosted glass (`backdrop-filter: blur`) across the entire application.
- This applies to the main sidebar, pop-up dialog boxes, the user profile drawer, action sheets, and the mobile bottom navigation bar.

### 2. Video Player OSD — Floating Glass Pills

- **Pill-Shaped Controls:** The top bar (back button, movie title, cast/sync icons) and the bottom bar (playback controls, seek bar) are restyled as floating rounded pill shapes instead of full-width bars.
- **Clear Glass Transparency:** Both OSD pills use ultra-low `0.1` (10%) opacity, matching the central play orb for a uniform, see-through aesthetic. The movie behind the controls is clearly visible.
- **No Double Overlay:** The parent OSD container is forced fully transparent to prevent layered glass effects that would make the bars look opaque.
- **All Buttons Visible:** Play/Pause orb, Rewind, Fast Forward, Volume, Settings, Subtitles, Fullscreen, Favorite, Next/Previous Track, Cast, and SyncPlay are all accessible.

### 3. Mobile Device Optimizations

- **Clear Glass (No Frosting):** On mobile devices, `backdrop-filter` blur is completely removed from OSD elements, resulting in a pure clear glass look without any frosting effect.
- **Text Sizing:** Reduces the font size of movie and TV show titles specifically on mobile phones. This prevents long titles from getting cut off or hidden.
- **Poster Sizing:** Adjusts the width of media cards on mobile so they fit the screen better.
- **Screen Rotation:** Adds a smooth 0.5-second CSS transition animation to the video player. When you rotate your phone from portrait to landscape, the video controls resize smoothly instead of instantly snapping and glitching.
- **Bottom Navigation:** Adds a subtle top border to the mobile bottom navigation bar to separate it from the main content.

### 4. General Tweaks & Bug Fixes

- **Hidden Badges:** Hides the small "Watched" (Checkmark) and "Favorite" (Heart) badge indicators that usually sit on top of movie posters.
- **Login Screen Bug Fix:** Removes aggressive CSS GPU hardware acceleration (`translateZ(0)` and `isolation`) specifically from the login form. This fixes a known bug where WebKit browsers (like Safari and iPhones) would freeze or ignore clicks on the username and password fields.

## How to use

Add one of the following to your **Jellyfin Dashboard -> General -> Custom CSS code**:

### 1. Stable Version (Main Branch)

Use this for normal, daily usage.

- **Mobile & Desktop (Web/App):**
  Use this for phones, tablets, browsers, and desktop clients.
  ```css
  @import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@main/liquid-glass-bundle.css");
  ```
- **Android TV / Fire TV:**
  Use this specifically for smart TVs and streaming sticks. It is optimized for TV layouts and remote control (D-Pad) focus states.
  ```css
  @import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@main/liquid-glass-tv.css");
  ```

***

### 2. Testing Version (Beta Branch)

Use this if you want to test experimental features (which may break things).

- **Mobile & Desktop (Web/App):**
  ```css
  @import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@testing/liquid-glass-bundle.css");
  ```
- **Android TV / Fire TV:**
  ```css
  @import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@testing/liquid-glass-tv.css");
  ```

***

### Why is the TV stylesheet separate?

Jellyfin's TV client has a completely different layout from the mobile/desktop app. It is built for a **10-foot interface** (large text/buttons read from a distance) and navigated using a **D-pad TV remote** (requiring clear glowing focus indicator styles when selecting buttons). Using the mobile CSS on a TV would break D-pad navigation and ruin the TV layout, so the styles are separated to keep TV functionality working perfectly.

***

### Note on Caching (Force Updating)

Because CDNs and browsers cache CSS files heavily, you might not see changes immediately when the theme is updated.

To force your browser or mobile app to bypass the cache and load the updates instantly, append a version parameter like `?v=1` or `?v=2` to the end of your import link:

```css
/* Example of force-updating the main bundle */
@import url("https://cdn.jsdelivr.net/gh/maniratansingh/jellyfin-liquid-glass@main/liquid-glass-bundle.css?v=2");
```

If the CSS changes again in the future, simply increase the number (e.g., `?v=3`) to force another update.


***
← [Back to GitHub Projects](/github/)
