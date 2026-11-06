---
title: "ShairDisplay: AirPlay 2 Hi-Fi Music Display & Precision Diagnostics"
description: "A room-scale, production-ready Now Playing display and vintage Hi-Fi diagnostic monitor for Shairport Sync (AirPlay 2) on Raspberry Pi / Linux."
section: projects
parent_link: "/projects/"
parent_text: "Projects"
---

# 🎵 ShairDisplay: AirPlay 2 Hi-Fi Music Display & Precision Diagnostics

A room-scale, production-ready Now Playing display and vintage Hi-Fi diagnostic monitor for **Shairport Sync (AirPlay 2)** on Raspberry Pi / Linux.

- **Interactive Live Demo:** [https://maniratansingh.github.io/ShairDisplay/](https://maniratansingh.github.io/ShairDisplay/)
- **Original Upstream Audio Engine:** [Shairport Sync by Mike Brady](https://github.com/mikebrady/shairport-sync)
- **Target Hardware:** Dedicated 1080p desktop monitors, wall-mounted displays, and TV screens connected to Raspberry Pi streamers via HDMI.

***

### 👑 Built for Shairport Sync by Mike Brady

**ShairDisplay** is designed specifically as a visual frontend and telemetry companion for **[Shairport Sync](https://github.com/mikebrady/shairport-sync)**, the foundational open-source AirPlay & AirPlay 2 audio player created and maintained by **Mike Brady (@mikebrady)**.

All credit for the underlying audio magic belongs to Mike Brady — Shairport Sync handles the complex AirPlay 2 protocol negotiation, Apple FairPlay/session handling, IEEE 1588 PTP multi-room sync, and bit-perfect ALSA DAC audio streaming. **ShairDisplay runs on top of Shairport Sync**, tapping directly into its D-Bus MPRIS interface (`org.mpris.MediaPlayer2.Player`), NQPTP shared memory, and Linux ALSA kernel telemetry to bring the audio stream to life visually on your display.

***

## Highlights & Capabilities

### 1. Dual-Mode Architecture (Now Playing & Hi-Fi Bench)
- **Tab 1: Room-Scale Now Playing Display:** Features oversized typography readable from across the room, full-bleed album art with glassmorphism overlays, monotonic progress bars, and dynamic backdrop styles (Fluid Ambient, Vintage Tube Amp Glow, or Stealth Blackout).
- **Tab 2: Precision Engineering Bench:** Real-time dual analog VU meters with authentic 300ms ballistic physics and peak needles, live 32-band Web Audio FFT spectrum analyzer, bit-perfect DAC audio resolution badge (44.1kHz / 48kHz, 16-bit / 24-bit), and IEEE 1588 PTP master clock sync diagnostics.

***

### 2. Standalone Zero-Configuration Architecture
- Single static HTML/CSS/JS client requiring zero compilation or Node.js runtime on the Raspberry Pi.
- Automatic reconnection engine with exponential backoff for headless kiosk boots.
- Fully offline operation with zero external cloud dependencies.

***

### Code Link
- [View Original Repository on GitHub (maniratansingh/ShairDisplay)](https://github.com/maniratansingh/ShairDisplay) ↗

***
← [Back to Projects](/projects/)
