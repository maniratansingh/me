---
title: "Sant Kabir Fleet Shield — Rural Medical Outreach Telemetry Wallboard"
description: "Real-time edge-native fleet command wallboard engineered for rural medical outreach ambulances and vision screening vans of Sant Kabir Eye Hospital in Basti, UP."
section: projects
parent_link: "/projects/"
parent_text: "Projects"
---

# 🛡️ Sant Kabir Fleet Shield

Real-Time Outreach Fleet Command & Telemetry Wallboard engineered for **Sant Kabir Eye Hospital**, Basti, Uttar Pradesh.

- **Infrastructure:** 100% Serverless on Cloudflare Pages (zero external databases, zero servers, zero monthly hosting costs).
- **Target Hardware:** Wallboard TV screens, hospital dispatch consoles, and Android telemetry clients.
- **Organization:** Sant Kabir Eye Hospital ([mrps.in](https://mrps.in))

***

## Overview

**Sant Kabir Fleet Shield** is an ultra-low-latency, edge-native fleet command wallboard engineered for rural medical outreach. It monitors hospital ambulances and vision screening vans dispatched from the base hospital in Basti across Eastern Uttar Pradesh.

The system pairs a hardened, private Android background client (`santkabir-fleet-shield-v1.0.apk`) with an edge-rendered command dashboard featuring Apple Maps-style precision aesthetics, 3D isometric vehicle projections, dynamic highway ribbons, and an automated TV Kiosk mode for continuous wallboard monitoring.

***

## Key Architecture & Features

### 1. Zero-Cost Serverless Telemetry
- Runs entirely on Cloudflare edge infrastructure without monthly server bills or external database overhead.
- Telemetry packets stream directly to edge workers with cryptographic token validation.

### 2. Rural Connectivity Resilience
- Purpose-built for rural connectivity dropouts across state highways and village roads in Eastern Uttar Pradesh.
- Android background telemetry client buffers coordinates and network telemetry locally during dead zones and flushes with atomic idempotency upon signal recovery.

### 3. Wallboard Operations & Kiosk Display
- Designed for continuous 24/7 TV kiosk projection in the hospital dispatch room.
- Dynamic status tracking for active patient transit, outreach eye camp screening sessions, emergency dispatch, and vehicle telemetry.

***

### Code Link
- [View Original Repository on GitHub (maniratansingh/santkabir-fleet-shield)](https://github.com/maniratansingh/santkabir-fleet-shield) ↗

***
← [Back to Projects](/projects/)
