# mrps.in — Personal Website

A framework-independent, static personal digital archive and directory.

- **Live Site:** https://mrps.in
- **Deployment Platform:** Cloudflare Pages (built dynamically from GitHub)
- **Source of Truth:** [ARCHITECTURE.md](file:///Users/mrps/projects/me/ARCHITECTURE.md)

---

## 📖 Essential Documentation
Before building or modifying the site, read these guides:
- **[ARCHITECTURE.md](file:///Users/mrps/projects/me/ARCHITECTURE.md):** The core system design. Contains the git branching model, technology constraints, media policies, and homepage rules.
- **[INSTRUCTION.md](file:///Users/mrps/projects/me/INSTRUCTION.md):** Explains how to use the automated python sync script to import READMEs directly from GitHub.

---

## 🚀 Quick Start & Development Commands

You can manage the project using the included `Makefile`:

### 1. Build the Site
Converts all Markdown in `content/` to static HTML5 in `site/`:
```bash
make build
```
*(Or run `bash build.sh`)*

### 2. Live Preview
Starts a local web server at `http://localhost:8080` to preview pages:
```bash
make serve
```

### 3. Clean Output
Wipes the generated compiled directory:
```bash
make clean
```

---

## 🛠️ Deployment Configuration
Deployments are fully automated. Every `git push` to the `main` branch triggers an automated build on Cloudflare Pages.

### Cloudflare Pages Build Settings:
- **Build Command:** `bash build.sh`
- **Build Output Directory:** `site`
- **Root Directory:** `/` (Project root)
- **Production Branch:** `main`

---

## 📂 Project Layout

```text
mrps.in/
├── build.sh              # Bash compile loop (Markdown -> site/)
├── Makefile              # Local helper commands (build, serve, clean)
├── _headers              # Cloudflare Pages security & cache configuration
├── ARCHITECTURE.md       # Development philosophy and branch strategies
├── INSTRUCTION.md        # AI script for syncing/formatting GitHub READMEs
│
├── content/              # Source Markdown files
│   ├── index.md          # Homepage directory (Introduction & links only)
│   ├── blog/             # Personal thoughts and posts
│   ├── projects/         # Technical projects imported from GitHub READMEs
│   └── photos/           # Links to external media storage
│
├── templates/            # HTML structural template layouts
│   ├── base.html         # Wrapper for inner pages (header, footer, nav)
│   └── index.html        # Wrapper for the homepage directory hero layout
│
└── static/               # Assets copied as-is to site/
    └── css/style.css     # Fluid-scale dark theme stylesheet
```
