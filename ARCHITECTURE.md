# Website Architecture & Development Philosophy

This document outlines the architectural constraints, Git branching strategy, content rules, and development workflows for `mrps.in`. Adhering to these rules keeps the site lightweight, framework-independent, and optimized for long-term AI and human maintenance.

---

## 1. Source of Truth
- **Markdown is the source of truth for content.**
- **GitHub is the source of truth for the repository.**
- **Cloudflare Pages is only a deployment target.**
- **Generated HTML is disposable and should never be edited manually.**

No content should ever be edited directly inside Cloudflare Pages or any other visual web editor. All modifications originate from Git commits pushed to the repository.

---

## 2. Directory Navigation Structure
The website navigation is permanently locked to exactly four top-level areas:
1. **Home:** Direct gateway to your links.
2. **Posts:** Space for personal thought updates and blog entries.
3. **Projects:** Documentation hub for software/hardware repositories.
4. **Photos:** Links to external galleries.

```text
  [Home]  ──  [Posts]  ──  [Projects]  ──  [Photos]
```

To preserve simplicity, **no other top-level pages or sections should ever be introduced.** There are no standalone "About", "Contact", "Resume", "Notes", "Reviews", or "Miscellaneous" pages. If any new information needs to be added to the site in the future, it must be accommodated within one of these four sections.

---

## 3. Homepage Philosophy
The homepage functions strictly as a directory, not a biography. It should only answer:
1. **Who am I?** (A short introduction of exactly 2–4 sentences).
2. **Where can visitors find me?** (Direct links to GitHub and Instagram).
3. **Where should they go next?** (Direct links to Posts, Projects, and Photos).

Avoid:
- Large hero images, graphics, or layout icons.
- Complex animation scripts or slide effects.
- Long biographies or redundant summaries.

---

## 4. GitHub Project Synchronization (Projects Section)
- **Projects Renaming:** The navigation lists this section as **Projects** instead of "GitHub" because visitors care about the projects themselves rather than the platform hosting them.
- **Canonical Documentation:** The repository README files on GitHub remain the canonical source of truth for all project documentation. The website project pages are generated automatically from these README files and **must never manually diverge**.
- **Outbound Linking:** Every project page includes a prominent "View Source on GitHub" link pointing back to the repository.

---

## 5. Media Policy & Storage
This repository must remain lightweight and fast to clone. Large assets are banned from being stored inside Git.
- **Photos:** Hosted on external storage (Google Photos or Google Drive).
- **Videos:** Embedded or linked from streaming services (YouTube).
- **Downloads:** Distributed via GitHub Releases.

**General Policy:** All large media and download binaries live outside this repository.

---

## 6. Git Branch Strategy & Promotion Path
To safeguard production code, all layout alterations, draft posts, and AI-generated concepts follow this linear promotion path:

```text
experimental
      │
      ▼
testing
      │
      ▼
main
      │
      ▼
Cloudflare Pages
      │
      ▼
mrps.in
```

1. **`experimental` (Research & Drafts):**
   - Used for design tests, prototypes, and raw AI-generated changesets.
   - Can be rebased, force-pushed, or deleted at any time.
2. **`testing` (Integration & Preview):**
   - Used for integrating updates, validating compiled HTML output locally, and testing preview deployments.
3. **`main` (Production Branch):**
   - The stable production branch. Every commit must be fully verified and buildable.
   - Cloudflare Pages automatically deploys every commit pushed to `main`.

---

## 7. Project Constraints (Longevity & Maintainability)
This project intentionally avoids unnecessary dependencies to maximize longevity, simplicity, and maintainability.

- **Zero JavaScript Build Dependencies:** The site is built using Bash and Pandoc without Node.js, package managers, or frontend frameworks.

### Excluded Technologies (Prohibited):
- **Frontend Frameworks:** React, Next.js, Astro, Vue, Svelte, Angular, Gatsby.
- **CSS Frameworks & Preprocessors:** Tailwind CSS, Bootstrap, Sass/SCSS.
- **Runtimes & Package Managers:** Node.js, npm, yarn, pnpm, webpack, vite.
- **Databases & Server Logics:** PostgreSQL, MongoDB, Server-Side Rendering (SSR), or server-side functions.

---

## 8. Git Policy for Compiled Output (`site/`)
To keep the repository size clean and Git history clutter-free, the compiled output folder (`site/`) is added to `.gitignore` and **must never be committed to GitHub**. 

Cloudflare Pages compiles the website during the deployment phase:
```text
GitHub Repository
        │
        ▼
Cloudflare Pages
        │
   bash build.sh
        │
        ▼
     Pandoc
        │
        ▼
     site/
        │
        ▼
    mrps.in
```

---

## 9. AI-First Principle
- The repository is designed to be maintainable by both humans and AI agents.
- Repository structure, naming conventions, and documentation should prioritize absolute clarity over cleverness.

---

## 10. Backup Strategy
Because GitHub acts as your source of truth, your backup strategy consists of three independent nodes:
1. **Local Clone:** A copy of the source code on your physical development machine.
2. **GitHub Repository:** The remote host.
3. **Cloudflare Deployment:** A static stateless snapshot of the latest compiled code.

---

## 11. Content Rules
- **Markdown First:** Content is written in Markdown. HTML elements are used only when Markdown cannot represent the target layout.
- **Formatting:** Keep paragraphs short, use clear list groupings to organize specs, and maintain a single `<h1>` heading per page.
- **Accessibility:** Ensure layout structures use semantic tags (`<header>`, `<main>`, `<nav>`) to support screen readers and keyboard navigation.
- **Performance:** Keep HTML/CSS code clean and avoid external scripts to ensure instant page load speeds.
