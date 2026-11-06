---
title: "Building OpenMapIndia: Zero-Backend Geocompute and Rural Healthcare Routing for 373,988 Villages"
description: "How I built a completely self-contained rural healthcare routing and geocompute platform for India with zero external APIs and zero hosting costs."
date: 2026-10-20
tags: [geocompute, india, mapping, healthcare, open-source]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

When looking at digital mapping tools for India, a clear divide becomes immediately obvious: urban corridors in metropolitan cities are richly detailed, but rural areas — where hundreds of millions of people live — are often treated as blank spaces between major highways.

More critically, building tools to analyze rural healthcare access usually involves costly enterprise APIs, complex map tile servers, or heavyweight PostgreSQL/PostGIS database clusters. For non-profit hospitals, rural outreach teams, or independent researchers, these infrastructure costs are prohibitive.

I wanted to challenge that status quo. I set out to build a platform that indexes every single village in India, maps its emergency route to the nearest Primary Health Centre, and analyzes district infrastructure accessibility — all running **100% statically in the browser with zero backend servers and zero API keys**.

The result is **[OpenMapIndia](https://maniratansingh.github.io/open-map-india/)** ([project details](/projects/open-map-india/)).

---

## 1. The Numbers: 35 States, 594 Districts, 373,988 Villages

Covering a nation as vast and diverse as India requires immense data discipline. OpenMapIndia indexes:
- All **35 States and Union Territories**.
- **594 Districts** nationwide.
- **373,988 verified Indian Villages**.
- Complete coordinates for **Primary Health Centres (PHCs)**, **Community Health Centres (CHCs)**, and District Hospitals.

Instead of hitting an external database on every keystroke, the entire national index is compressed and partitioned into static binary data chunks. In the web interface, searching for any remote village in Bihar, Uttar Pradesh, or Rajasthan executes with sub-50ms fuzzy filtering entirely in memory.

---

## 2. Zero-External API Architecture

The core engineering rule behind OpenMapIndia is absolute self-reliance:
- **No Google Directions or Mapbox APIs:** Third-party routing APIs enforce strict request quotas and bill unpredictably. In OpenMapIndia, rural healthcare vectors and highway connection geometries are precomputed offline and served statically from GitHub.
- **No Heavy Vector Tile Servers:** Map rendering is handled client-side using native HTML5 Canvas and WebGL, plotting geographic polygons and road links smoothly on low-end laptops and mobile phones.
- **Zero Hosting Fees:** Hosted permanently on GitHub Pages, ensuring the project remains publicly accessible forever without recurring cloud server bills.

---

## 3. Real-World Value: Measuring Emergency Care Access

The real purpose of OpenMapIndia is not just drawing lines on a screen; it is measuring real-world transit time to emergency care.

When a user selects a village, the engine instantly computes:
1. The exact straight-line and road-network distance to the nearest functional hospital or Primary Health Centre.
2. The nearest arterial state or national highway junction.
3. An accessibility score that highlights districts where rural populations face severe geographic isolation from trauma and surgical care.

Try the interactive platform live at **[maniratansingh.github.io/open-map-india](https://maniratansingh.github.io/open-map-india/)** or check out the [source code on GitHub](https://github.com/maniratansingh/open-map-india).
