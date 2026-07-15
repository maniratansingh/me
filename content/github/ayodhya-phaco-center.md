---
title: "Ayodhya Phaco Center Website"
description: "Official static website repository for the Ayodhya Phaco Center clinic."
section: github
---

# Ayodhya Phaco Center 🏥

Welcome to the official repository for the **Ayodhya Phaco Center** website.

## About Us
Ayodhya Phaco Center is a certified premium eye care and cataract surgery clinic located in Ayodhya, Uttar Pradesh. We specialize in advanced eye diagnostics, laser treatments, and premium cataract surgeries. We proudly offer free surgeries under the PM-JAY Ayushman Bharat Yojana for eligible patients.

## Features
- **Responsive Design**: Custom-built adaptive layouts for both desktop and mobile devices.
- **Dynamic Booking System**: Integrated appointment booking system with automated Telegram bot notifications for hospital staff.
- **Performance Optimized**: Zero layout shifts (CLS), preloaded core assets, and lightning-fast load times.
- **Glassmorphism UI**: Modern frosted-glass aesthetics with liquid gradients and smooth micro-animations.

## Technology Stack
- Vanilla HTML5 / CSS3 / JavaScript
- Telegram Bot API for backend communications
- Fully static, ready for Cloudflare Pages deployment

## Important Note
For security purposes, the Telegram API keys have been removed from this public repository. To enable the booking system, a secure backend function (e.g., Cloudflare Pages Functions) must be configured to handle the Telegram Bot Token as an environment variable.

***

## Comprehensive Project Overview

### 1. The Core Architecture
This website is built as a **Static Site** using purely modern web technologies: HTML5, CSS3, and JavaScript. 
- **Why this matters:** Unlike WordPress or PHP sites that require a database and a slow server, static site files load almost instantly, cannot be easily hacked (due to the lack of a database), and can be hosted for free on global networks like Cloudflare Pages.

#### Desktop vs. Mobile Routing
We built two separate versions of the site to ensure the best possible experience on all devices: `index.html` (Desktop) and `mobile.html` (Mobile).
- **How it works:** When a user visits the main domain, they hit `index.html`. A lightweight JavaScript function detects their user-agent. If they are on a mobile device, it instantly and invisibly routes them to `mobile.html`.
- **The Benefit:** There is no need for a complex `m.` subdomain. Everything happens automatically on one main link.

### 2. The Booking System & Telegram Integration
Instead of dealing with complicated email servers or forcing users to open external apps, we integrated a custom **Telegram Bot**.

#### How the Telegram Bot Works:
1. A custom bot (`@apcmrpsbot`) was created and added to a private hospital group chat.
2. When a patient fills out the booking form and clicks "Confirm", the website formats their details (Name, Phone, Date, Service, Notes) into a Markdown message.
3. The frontend makes a direct background `fetch` request to the official Telegram Bot API, passing the token and Chat ID.
4. Telegram receives this request and instantly drops the message into the hospital's group chat.

#### The Success Feedback Loop:
- The form submission is handled asynchronously (AJAX). It does not reload the page.
- It smoothly hides the form and displays a **"Request Submitted!"** success message within the modal.
- On Mobile, a highly visible Red Cross button allows patients to easily dismiss the popup, which automatically resets the form state in the background.

### 3. Security Considerations
Because this is a public repository, exposing the raw Telegram Token inside the frontend JavaScript would allow automated bots to scrape the key and hijack the bot.
- **The Solution:** We created this specific `git_upload` version of the codebase where the Telegram Token and Chat ID have been completely stripped out and replaced with empty strings. 
- **The Live Deployment:** The actual production deployment uses an obfuscated version of the key or a secure Cloudflare Pages Function backend to ensure the bot remains secure while keeping the public repository clean.

### 4. Design Aesthetics
The visual design focuses on a modern **Glassmorphism** aesthetic.
- **Liquid Glass:** We used advanced CSS techniques (`backdrop-filter: blur`) to create semi-transparent, frosted-glass panels that float over background imagery.
- **Mobile Readability:** The opacity of the mobile booking form was carefully tuned. It provides a perfect middle ground—opaque enough to make text highly readable, but transparent enough to retain the premium frosted glass effect.

***
*Dedicated to preserving vision and providing world-class eye care.*


***

### Code Link
- [View Original Repository on GitHub](https://github.com/maniratansingh/ayodhya-phaco-center) ↗

***
← [Back to GitHub Projects](/github/)
