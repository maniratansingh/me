# mrps.in — Personal Website

**Live site:** https://mrps.in  
**Owner:** Mani Ratan Pratap Singh  
**Deployed via:** Cloudflare Pages (auto-deploy on push to `main` branch)

---

## 📖 Architecture & Developer Guides
Before making any updates, changes, or experiments, please read:
- **[ARCHITECTURE.md](file:///Users/mrps/projects/me/ARCHITECTURE.md):** Outlines technology constraints (no npm, no React/Astro), branching guidelines (`main` ──► `testing` ──► `experimental`), content structure, media rules, and homepage constraints.
- **[INSTRUCTION.md](file:///Users/mrps/projects/me/INSTRUCTION.md):** Guides you on how to run the python synchronization script to import project README files directly from GitHub and resolve rendering issues.

---

## How This Site Works

Content is written in **Markdown** (`.md` files in `content/`).  
The `build.sh` script converts them into **static HTML** using [Pandoc](https://pandoc.org/).  
The output goes into `site/` — that directory is what Cloudflare Pages serves.

```
Markdown (content/) → build.sh + pandoc → HTML (site/) → Cloudflare Pages → mrps.in
```

**Dependencies:** `pandoc` only. No Node.js. No npm. No frameworks.

---

## Repository Structure

```
mrps.in/
├── build.sh              # Run this to build the site
├── _headers              # Cloudflare Pages cache + security headers
├── ARCHITECTURE.md       # Development philosophy, branching, and stack rules
├── INSTRUCTION.md        # Script for importing/syncing READMEs from GitHub
│
├── content/              # All content — edit these files
│   ├── index.md          # Homepage (About & Connect)
│   ├── blog/             # Personal Posts / Blog
│   ├── github/           # GitHub Projects / Repos
│   └── photos/           # Photography external links
│
├── templates/            # HTML wrappers (nav, head, footer)
│   ├── base.html         # Used by all pages except homepage
│   └── index.html        # Used by homepage only
│
├── static/               # Copied as-is into site/
│   └── css/style.css     # All CSS (Fluid scaling up to 4K / 10 Gbps ready)
│
└── site/                 # BUILD OUTPUT — git-ignored
```

---

## Frontmatter Reference

Every Markdown file starts with a YAML block between `---` fences:

```yaml
---
title: "Page Title"                     # Required — appears in <title> and <h1>
description: "Short page description"   # Recommended — used for SEO meta
date: 2026-07-15                        # For blog posts, notes, reviews
tags: [thought, personal, homelab]      # Optional list of tags
section: blog                           # blog | github | photos
cover: /img/cover.jpg                   # Optional — used for OG image
---
```

---

## Common AI Tasks

### Publish a Blog / Thought Post

1. Create a new file: `content/blog/YYYY-MM-DD-slug.md`
2. Write content using the template below
3. Add an entry to `content/blog/index.md` (newest first)

**Blog post template:**

```markdown
---
title: "Post Title"
description: "One sentence description."
date: YYYY-MM-DD
tags: [tag1, tag2]
section: blog
---

Post content here.

---

← [Back to Posts](/blog/)
```

---

### Add/Update a GitHub Project / Repo Description

To add a new repository or sync updates from existing repositories, follow the automated synchronization process described in [INSTRUCTION.md](file:///Users/mrps/projects/me/INSTRUCTION.md). 

Briefly:
1. Open [INSTRUCTION.md](file:///Users/mrps/projects/me/INSTRUCTION.md) and copy the `update_projects.py` script code.
2. Run it using Python to automatically fetch your repository README file from GitHub, format it correctly with site metadata, resolve relative paths to absolute raw links (like circuit diagrams), and append the original repository link:
   ```bash
   python3 update_projects.py
   ```
3. Add the project link to the list in `content/github/index.md`.

---

### Update Photos Links

To add/change your Google Drive or other external photo gallery links, edit `content/photos/index.md` directly.

---

## Build Locally

```bash
# Install pandoc (one-time)
brew install pandoc          # macOS
sudo apt install pandoc      # Ubuntu/Debian

# Build the site
bash build.sh

# Preview (Python built-in server)
cd site && python3 -m http.server 8080
# Then open http://localhost:8080
```

---

## Deployment

**Cloudflare Pages settings:**

| Setting | Value |
|---------|-------|
| Build command | `bash build.sh` |
| Build output directory | `site` |
| Branch | `main` |

Every `git push` to `main` triggers a new deploy automatically.
