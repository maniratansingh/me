---
title: "Why I Built My Own Web Music Player & Vinyl Turntable"
description: "Reflections on modern music streaming bloat, bringing back the tactile charm of vinyl records on the web, and building a clean player for road trips."
date: 2026-10-14
tags: [music, web, reflection, personal]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

Opening a modern music streaming app often feels like walking into a crowded airport terminal. Between algorithmic recommendations, podcast banners, promotional pop-ups, and endless menus, the simple act of listening to music gets buried under layers of noise.

I wanted something different: a calm, focused space to play my favorite tracks without distractions, paired with the tactile visual charm of an analog vinyl record. 

So, I built [MRPS MUSIC](https://maniratansingh.github.io/aesthetic-music-player/) ([project details](/projects/aesthetic-music-player/)). Here are my personal thoughts on why I built it, the experience of crafting it, the technical choices behind it, and what I learned along the way.

---

## 1. Missing the Intentionality of Vinyl

There is a timeless feeling to physical vinyl records. You pick an album, place it on the turntable platter, pull the tonearm over, and watch the needle gently settle into the groove. It turns music listening from passive background noise into an intentional experience.

On modern screens, everything has been flattened into tiny play/pause buttons and generic progress bars. 

When building MRPS Music, I wanted to bring that tactile magic to the browser:
- An animated picture-disc turntable that rotates in sync with the track playback rate.
- A mechanical tonearm that physically swings across to the outer rim of the record when you hit play, rests on the grooves, and returns home when paused.
- Subtle tracking wobble animation (`armTrackingWobble`) and needle suspension compliance (`needleCompliance`) that mimic real turntable mechanics.

Watching the turntable spin while a track plays gives the web player a warm, analog heartbeat that generic audio apps simply lack.

---

## 2. Road Trips & the Real-World Driving Test

Music belongs on the road. One of my biggest motivations was having a clean player I could use during highway drives without wrestling with clunky mobile interfaces.

When you are driving, you cannot fiddle with touchscreens or tiny icons. It has to just work with your vehicle's physical controls. To achieve this, I tapped into the browser's **W3C Media Session API**:

```javascript
// Registering physical vehicle controls
if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: currentTrack.title,
    artist: currentTrack.artist,
    artwork: [
      { src: currentTrack.art96,  sizes: '96x96',   type: 'image/jpeg' },
      { src: currentTrack.art512, sizes: '512x512', type: 'image/jpeg' }
    ]
  });

  navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
  navigator.mediaSession.setActionHandler('previoustrack', () => playPrev());
  navigator.mediaSession.setActionHandler('seekforward', (details) => seekRelative(details.seekOffset || 10));
  navigator.mediaSession.setActionHandler('seekbackward', (details) => seekRelative(-(details.seekOffset || 10)));
}
```

By continuously feeding live elapsed time and duration into `navigator.mediaSession.setPositionState()`, the vehicle's infotainment progress bar illuminates and scrubs in real time. Combined with the **Screen Wake Lock API** (`navigator.wakeLock.request('screen')`), the display never sleeps while cruising on the highway.

Taking this out on the road and having steering wheel controls effortlessly change tracks over Android Auto felt magical—all running from a static web page without needing a bulky native app.

---

## 3. The Beauty of Zero Frameworks & WebGL Shaders

We live in an era where people install hundreds of megabytes of `node_modules` just to center a button or play an audio file.

For this project, I stuck to a simple philosophy: **vanilla HTML, modern CSS, and clean client-side JavaScript.** 

* **Procedural Ambient Shader:** Instead of loading heavy video loops, the background uses a lightweight WebGL 2.0 fragment shader (`shader.js`). It generates Inigo Quilez simplex noise and trigonometric warp waves directly on the GPU, creating a soothing liquid backdrop with minimal CPU overhead.
* **Liquid Glassmorphism:** The interface utilizes pure CSS `backdrop-filter: blur(28px)` and specular highlights for a frosted glass look that respects safe-area insets (`env(safe-area-inset-bottom)`) and dynamic viewport units (`100dvh`).
* **Offline-Ready PWA:** A lightweight Service Worker (`sw.js`) pre-caches core layout assets, while `manifest.webmanifest` enables standalone WebAPK installation on Android—removing all browser navigation bars.

There is no build pipeline, no bundler, and no server backend. It runs instantly anywhere—on my laptop, my phone, or in a car browser.

---

## Final Thoughts

Building tools tailored to your own personal taste is one of the most rewarding parts of technology. You don't have to worry about engagement metrics, monetization, or pleasing algorithms. You simply create something you enjoy using every day.

Whenever I put on a playlist now, watch the virtual needle drop, and let the track play, it reminds me of why I love building things in the first place.

***

### Code & Repository
- [View aesthetic-music-player on GitHub](https://github.com/maniratansingh/aesthetic-music-player) ↗
- [Explore the Live Web Player](https://maniratansingh.github.io/aesthetic-music-player/) ↗

***

← [Back to Posts](/blog/)
