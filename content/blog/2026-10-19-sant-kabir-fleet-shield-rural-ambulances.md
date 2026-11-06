---
title: "Sant Kabir Fleet Shield: Edge-Native Telemetry Wallboards for Rural Outreach Ambulances"
description: "Engineering a real-time hospital dispatch wallboard and Android telemetry client for rural vision screening vans in Basti, UP."
date: 2026-10-19
tags: [hospital, telemetry, edge, cloudflare, purvanchal]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

Operating a charitable eye hospital in Purvanchal (Eastern Uttar Pradesh) means running daily mobile outreach missions into deeply rural areas. Every morning, vans and ambulances from **Sant Kabir Eye Hospital** in Basti depart to set up free eye checkup camps, screen patients for cataracts, and transport surgical cases back to the base hospital.

For years, tracking these vehicles relied on sporadic phone calls: *"Where are you now? Have you reached the village? Did you get through the highway checkpoint?"* In areas with patchy 2G/4G coverage, communication frequently dropped entirely.

Commercial fleet management systems charge expensive monthly subscriptions per vehicle and depend on fragile cloud dashboards that require frequent logins and manual refreshing.

I built **[Sant Kabir Fleet Shield](/projects/santkabir-fleet-shield/)** to replace that with an edge-native, continuous wallboard telemetry system that runs at zero monthly infrastructure cost.

---

## 1. Wallboard-First Dispatch Center Display

In the hospital dispatch room, nurses and administrators don't have time to fiddle with mouse clicks, drop-down menus, or browser zoom controls. The display needs to function like an air traffic control radar:

- **24/7 TV Kiosk Projection:** Formatted for a large wall-mounted 1080p display with a high-contrast dark theme that is readable across the room.
- **Isometric Vehicle Projections:** Real-time visual tracking of outreach ambulances and screening vans with dynamic movement vectors.
- **Operational Metrics at a Glance:** Live tallies of active transit patients, completed village vision camps, and vehicle battery/engine telemetry.

---

## 2. Surviving Rural Network Blackouts

The biggest technical challenge in Purvanchal is rural connectivity dropouts. Between village roads and remote agricultural belts, mobile internet connection frequently drops to zero for 15 to 45 minutes at a time.

If a telemetry client assumes a constant WebSocket or HTTP stream, data is either lost forever or crashes the background process.

To solve this, I wrote a hardened, minimal Android telemetry service:
- Coordinates and network diagnostic metrics are recorded locally to an encrypted SQLite store during network dead zones.
- When cell towers reconnect, buffered points are flushed to the Cloudflare edge worker using idempotent batch requests.
- The dispatch wallboard automatically shows a "Signal Loss Buffer" indicator with the last known coordinate timestamp, preventing panic while preserving exact transit history.

---

## 3. 100% Serverless on Cloudflare Edge

By leveraging Cloudflare Pages and Edge Workers, the entire telemetry ingestion and wallboard broadcasting pipeline operates with zero physical server maintenance and zero monthly hosting bills. 

Every rupee saved on server infrastructure goes directly where it belongs: providing free eye care, surgical consumables, and cataract treatments to patients across Basti, Sant Kabir Nagar, and Siddharthnagar.

Explore the [project overview on this site](/projects/santkabir-fleet-shield/) or view the [GitHub repository](https://github.com/maniratansingh/santkabir-fleet-shield).
