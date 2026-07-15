# mrps.in — Personal Website

**Live site:** https://mrps.in  
**Owner:** Mani Ratan Pratap Singh  
**Deployed via:** Cloudflare Pages (auto-deploy on push to `main`)

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
├── _redirects            # Cloudflare Pages URL redirects
│
├── content/              # All content — edit these files
│   ├── index.md          # Homepage
│   ├── about.md          # About page
│   ├── contact.md        # Contact page
│   ├── blog/             # Blog posts
│   ├── photography/      # Photo albums
│   ├── projects/         # Project pages
│   ├── docs/             # Documentation
│   ├── repos/            # GitHub repositories
│   ├── reviews/          # Product reviews
│   └── notes/            # Daily notes
│
├── templates/            # HTML wrappers (nav, head, footer)
│   ├── base.html         # Used by all pages except homepage
│   └── index.html        # Used by homepage only
│
├── static/               # Copied as-is into site/
│   ├── css/style.css     # All CSS
│   └── img/              # Images (avatar, etc.)
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
date: 2024-02-02                        # For blog posts, notes, reviews
tags: [photography, night, lucknow]     # Optional list of tags
section: blog                           # blog | photography | project | doc | review | note
cover: /img/cover.jpg                   # Optional — used for OG image
featured: true                          # Optional — mark as featured on homepage
---
```

---

## Common AI Tasks

### Publish a Blog Post

1. Create a new file: `content/blog/YYYY-MM-DD-slug.md`
2. Write content using the template below
3. Add an entry to `content/blog/index.md` (newest first)
4. Update the homepage `content/index.md` Recent Posts list if desired

**Blog post template:**

```markdown
---
title: "Post Title"
description: "One sentence description."
date: YYYY-MM-DD
tags: [tag1, tag2]
section: blog
cover: /img/cover.jpg
---

Post content here.

---

← [Back to blog](/blog/)
```

---

### Add a Photography Album

1. Create: `content/photography/album-name.md`
2. Add a card to `content/photography/index.md`

**Album page template:**

```markdown
---
title: "Album Title"
description: "Short description."
section: photography
cover: /img/albums/cover.jpg
---

Brief introduction to the album.

---

<div class="photo-grid">
  <a href="/blog/linked-post/">
    <img src="/img/photo.jpg" alt="Description" loading="lazy" />
  </a>
</div>

← [Back to Photography](/photography/)
```

---

### Add a Project Page

1. Create: `content/projects/project-name.md`
2. Add an entry to `content/projects/index.md`

**Project template:**

```markdown
---
title: "Project Name"
description: "What it is and what it does."
date: YYYY-MM-DD
tags: [esp32, electronics]
section: projects
---

## What is this?

Description.

## Status

In progress / Complete / Archived.

## Hardware

List of components.

## Software

Links to code.

← [Back to Projects](/projects/)
```

---

### Add a Daily Note

1. Create: `content/notes/YYYY-MM-DD-slug.md`
2. Add an entry to `content/notes/index.md`

**Note template:**

```markdown
---
title: "Short title"
date: YYYY-MM-DD
section: notes
---

Quick note content.

← [Back to Notes](/notes/)
```

---

### Add a Product Review

1. Create: `content/reviews/product-name.md`
2. Add entry to `content/reviews/index.md`

**Review template:**

```markdown
---
title: "Product Name — Review"
description: "Short verdict."
date: YYYY-MM-DD
tags: [camera, audio, gear]
section: reviews
---

## Summary

One paragraph verdict.

## What I Like

- Point

## What I Don't Like

- Point

## Who It's For

Recommendation.

← [Back to Reviews](/reviews/)
```

---

### Add a Documentation Page

1. Create: `content/docs/topic/page-name.md` (nest in subdirectory by topic)
2. Add entry to `content/docs/index.md`

**Doc template:**

```markdown
---
title: "Topic — Page Title"
description: "What this covers."
section: docs
---

## Overview

...

← [Back to Docs](/docs/)
```

---

### Add a GitHub Repository

Edit `content/repos/index.md` and add an `<li>` entry:

```html
<li class="post-list-item">
  <a class="post-list-title" href="https://github.com/USERNAME/repo" target="_blank" rel="noopener">repo-name ↗</a>
  <span class="post-list-date">Python · 2024</span>
</li>
```

---

### Update Navigation

The nav is in two places:

- `templates/base.html` — `<nav class="site-nav">` (top nav, all pages)
- `templates/index.html` — same nav for homepage
- `templates/base.html` — `<nav class="footer-nav">` (footer nav, all pages)
- `templates/index.html` — same footer for homepage

Edit both files when adding a new nav item.

---

### Summarise GitHub Commits into a Blog Post

Prompt to give an AI:

> Here are the git commits from today: [paste `git log --oneline` output].
> Write a blog post for mrps.in in the format used in `content/blog/`. 
> Filename: `content/blog/YYYY-MM-DD-todays-work.md`.
> Title: brief summary of what was accomplished.
> Write in first person, casual tone.

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

---

## Design Tokens (CSS Variables)

Defined in `static/css/style.css` at the top under `:root {}`.

| Token | Value | Purpose |
|-------|-------|---------|
| `--bg` | `#0a0a0a` | Page background |
| `--bg-surface` | `#111111` | Cards, nav |
| `--text` | `#e2e2e2` | Body text |
| `--text-muted` | `#777777` | Secondary text |
| `--accent` | `#00d084` | Green accent, links |
| `--font-sans` | IBM Plex Sans | Headings |
| `--font-mono` | IBM Plex Mono | Body text |
| `--max-prose` | `680px` | Content max width |

---

## Adding Images

1. Place images in `static/img/`
2. Reference them as `/img/filename.jpg` in Markdown
3. Or link to external images (e.g. old WordPress uploads) directly by URL

For large photo albums, it's fine to keep linking to the original WordPress CDN URLs for now and migrate later.

---

## Content Principles

- **One file = one page.** Never split a single logical page across multiple files.
- **Clean URLs.** File `content/blog/my-post.md` → URL `/blog/my-post/`
- **Dates in filenames.** Blog posts, notes, and reviews: `YYYY-MM-DD-slug.md`
- **No date in filenames** for evergreen content: projects, docs, photography albums, about, contact.
- **AI instructions in comments.** Where a human or AI needs to know where to insert new items, a `<!-- AI INSTRUCTION: ... -->` comment explains it.
- **Keep it simple.** If something can be a link list, make it a link list. Don't over-engineer.

---

## File Naming Rules

| Content type | Directory | Filename pattern |
|---|---|---|
| Blog post | `content/blog/` | `YYYY-MM-DD-slug.md` |
| Photography album | `content/photography/` | `album-name.md` |
| Project | `content/projects/` | `project-name.md` |
| Doc page | `content/docs/topic/` | `page-name.md` |
| Review | `content/reviews/` | `product-name.md` |
| Note | `content/notes/` | `YYYY-MM-DD-slug.md` |
| Section index | any of the above | `index.md` |
