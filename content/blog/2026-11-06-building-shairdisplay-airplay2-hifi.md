---
title: "Building ShairDisplay: Room-Scale Now Playing & Ballistic VU Telemetry for AirPlay 2"
description: "Reflections on building a dedicated room-scale Hi-Fi display and diagnostic bench for Shairport Sync on Raspberry Pi."
date: 2026-11-06
tags: [music, airplay, raspberrypi, hifi, reflection]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

Streaming music over AirPlay 2 is seamless on an iPhone or Mac, but when you are across the room sitting on the couch or listening through high-end speakers, looking at a small smartphone screen breaks the immersion. Commercial audio streamers often have either no display at all, or tiny 2-inch OLEDs that you can only read from six inches away.

I wanted a true **room-scale Now Playing display** that turns a dedicated 22-inch 1080p monitor or TV into an elegant visual centerpiece. And because I appreciate audio engineering, I also wanted real-time technical telemetry — ballistic VU meters, an FFT spectrum analyzer, and bit-perfect DAC resolution monitoring.

So I built **[ShairDisplay](https://maniratansingh.github.io/ShairDisplay/)** ([project details](/projects/shairdisplay/)).

---

## 1. Standing on the Shoulders of Shairport Sync

Before talking about visual design, credit must go to **Mike Brady**, the creator of **[Shairport Sync](https://github.com/mikebrady/shairport-sync)**. Shairport Sync is the gold standard for open-source AirPlay 2 on Linux, solving the formidable challenges of Apple FairPlay session handshakes, IEEE 1588 PTP multi-room microsecond clock synchronization, and bit-perfect ALSA audio pipelines.

ShairDisplay runs as a companion on top of Shairport Sync. It connects directly to Shairport Sync's D-Bus MPRIS interface (`org.mpris.MediaPlayer2.Player`), reading track metadata, album artwork streams, and playback state without adding any latency or overhead to the audio playback thread.

---

## 2. Room-Scale Typography and Ambient Backdrops

A display meant to be viewed from 10 feet away has very different design constraints than a smartphone app:
- **Oversized Sans Typography:** Track titles and artists are sized using fluid clamp units that remain effortlessly legible across the living room.
- **Dynamic Ambient Color Engine:** The background dynamically samples dominant hues from the active album artwork, creating a soft, luminous color glow that bathes the wall behind the display.
- **Tube Amp Glow & Stealth Modes:** For late-night listening sessions, you can toggle into an amber tube-amp glow or a blackout mode that turns off all bright elements except the track title and volume dial.

---

## 3. Real Ballistic Physics for Analog VU Meters

Most digital "VU meters" on the web are just linear progress bars that jump erratically with volume changes. True analog VU meters have precise physical ballistics:
- An integration rise time of approximately 300 milliseconds.
- A controlled overshoot of 1% to 1.5%.
- A weighted needle return dampener.

In ShairDisplay's **Hi-Fi Engineering Bench**, the dual analog VU meters simulate authentic galvanometer needle physics in real-time. Paired with a 32-band Web Audio FFT spectrum analyzer and DAC sample rate indicators, it brings the tactile, diagnostic joy of vintage McIntosh and Marantz gear directly to modern streaming.

Check out the interactive live demo at **[maniratansingh.github.io/ShairDisplay](https://maniratansingh.github.io/ShairDisplay/)** or view the [GitHub repository](https://github.com/maniratansingh/ShairDisplay).
