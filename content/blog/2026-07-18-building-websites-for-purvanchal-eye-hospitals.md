---
title: "Building Fast, Simple Websites for Real Hospitals in Purvanchal"
description: "Reflections on designing lightweight static websites with Telegram bot notifications for eye care clinics across Ayodhya, Sultanpur, and Basti."
date: 2026-07-18
tags: [web, health, purvanchal, reflection]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

When building websites, it is easy to assume that everyone has the latest iPhone and a lightning-fast fiber optic connection. But when you build for real-world healthcare in regional India, those assumptions quickly fall apart.

Over the past few months, I had the opportunity to build the official web presences for three regional eye hospitals in the Purvanchal network of Uttar Pradesh:
- **[Ayodhya Phaco Center](/projects/ayodhya-phaco-center/)** (Ayodhya)
- **[Sunbeam Eye Hospital](/projects/sunbeam-eye-hospital/)** (Sultanpur)
- **[Sant Kabir Eye Hospital](/projects/sant-kabir-eye-hospital/)** (Basti)

These are not tech startups or corporate portfolios; they are functioning surgical clinics where patients seek treatment for cataracts, vision impairments, and check eligibility for free surgeries under the PM-JAY Ayushman Bharat Yojana.

Here are my personal reflections on what designing for regional healthcare taught me about technology, simplicity, and architecture.

---

## 1. Respecting the Patient's Reality

Many of the people visiting these hospital sites are elderly patients, their sons or daughters, or families traveling from nearby villages on budget smartphones over spotty 3G/4G connections.

If a hospital website takes 8 seconds to load, freezes while downloading 15MB of heavy JavaScript trackers, or hides doctor timings behind confusing menus, it fails the people who need it most.

Our design goals were straightforward:
- **Immediate Load Time:** Pages must appear virtually instantly, even on weak cellular reception.
- **Clear Information Hierarchy:** Doctor specializations, clinic addresses, emergency numbers, and PM-JAY Ayushman Bharat details must be front and center.
- **Zero Layout Shifts (CLS):** Preloaded critical assets and system font fallbacks ensure no jumping banners or delayed reflows that cause elderly users to accidentally tap the wrong button.

---

## 2. Why Heavy Frameworks and WordPress Were the Wrong Choice

The standard industry approach for small business websites is to spin up a WordPress installation with dozens of plugins or build a heavy React single-page app.

For these clinics, that would have been a mistake:
- WordPress databases can be sluggish, require constant security updates, and are vulnerable to automated bot exploits.
- Heavy modern JavaScript frameworks ship enormous bundles of code that budget mobile processors struggle to parse.

Instead, we chose pure **vanilla HTML5, clean modern CSS, and minimal JavaScript**, deployed on Cloudflare’s global edge network. 

Because the entire website consists of static files:
- It achieves a sub-300ms First Contentful Paint (FCP).
- There is no database that can crash or be compromised.
- Hosting is practically free, requires zero server maintenance, and is 100% resilient under traffic spikes.

---

## 3. The Telegram Bot: Simple, Reliable Appointment Alerts

One of the key requirements was an online appointment booking system.

The conventional tech answer would be setting up a database, creating an admin login portal, and sending email alerts. But in a busy regional hospital, clinic staff and receptionists don't sit in front of desktop email inboxes all day. They have their phones in their pockets, and they use messaging apps constantly.

Instead of building a complicated portal, we wired the appointment form directly to a **custom Telegram Bot**:

```javascript
// Asynchronous appointment booking dispatch via Telegram Bot API
const payload = {
  chat_id: HOSPITAL_GROUP_CHAT_ID,
  parse_mode: 'Markdown',
  text: `🏥 *New Appointment Request*\n\n` +
        `*Patient:* ${name}\n` +
        `*Phone:* ${phone}\n` +
        `*Date:* ${preferredDate}\n` +
        `*Department:* ${service}\n` +
        `*Notes:* ${notes}`
};

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => showSuccessFeedback())
.catch(err => showErrorNotice());
```

### The Operational Flow:
1. When a patient submits their name, phone number, and desired date, the frontend fires a quick background request to the Telegram Bot API.
2. The bot instantly drops a neatly formatted message directly into the hospital receptionists' private group chat.
3. The staff's phone buzzes immediately, and they can call the patient back within minutes to confirm the appointment.
4. For security, raw tokens are abstracted behind Cloudflare Pages Functions in production deployments, keeping the public repositories clean.

No login dashboards, no unread emails, and no missed inquiries.

---

## Final Thoughts

Working on these hospital sites reinforced a core belief: **good engineering is not about showing off how complex you can make something; it is about finding the simplest solution that genuinely serves people.**

Knowing that these fast, clean pages help real patients across Ayodhya, Sultanpur, and Basti connect with doctors and find surgical care has been one of the most fulfilling projects I've worked on.

***

### Code & Repositories
- [Ayodhya Phaco Center on GitHub](https://github.com/maniratansingh/ayodhya-phaco-center) ↗
- [Sunbeam Eye Hospital on GitHub](https://github.com/maniratansingh/sunbeam-eye-hospital) ↗
- [Sant Kabir Eye Hospital on GitHub](https://github.com/maniratansingh/sant-kabir-eye-hospital) ↗

***

← [Back to Posts](/blog/)
