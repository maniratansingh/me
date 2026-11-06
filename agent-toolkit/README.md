# MRPS Agent Toolkit

MRPS Agent Toolkit is a fully static directory of open-source developer tools, CLI utilities, libraries, and agent skills curated for coding agents (such as Codex, Antigravity, Claude Code, and Cursor).

Live at: `https://mrps.in/agent-toolkit/`

## Philosophy
- **A directory, not a replacement**: Every tool links to its canonical repository, author, and documentation. No upstream code is forked or rehosted.
- **Strict write boundary**: Auditors and launchers witness and report; they never edit source, config, or manifests.
- **Zero npm dependencies**: The entire build pipeline is self-contained using Node.js built-in modules (`node:fs`, `node:path`).
- **Fully accessible & static**: Works with JavaScript disabled, passes WCAG 2.2 AA contrast and keyboard accessibility, and has zero third-party network requests on load.

## Repository Structure
```
/agent-toolkit/
├── index.html                 # Directory homepage
├── index.json                 # Machine-readable capability index
├── AGENTS.md                  # Operational guidance for coding agents
├── CREDITS.md                 # Project attribution and upstream licenses
├── llms.txt                   # LLM indexing format
├── _headers                   # Cloudflare Pages caching rules
├── og.png                     # Social sharing image (1200×630)
├── tools/
│   ├── <id>.json              # Per-tool data
│   └── <id>.html              # Per-tool page (13 required sections)
├── instructions/              # Category operational instruction sheets
│   ├── GLOBAL.md
│   ├── UI-UX.md
│   ├── TESTING.md
│   ├── ACCESSIBILITY.md
│   ├── SECURITY.md
│   ├── CODE-ANALYSIS.md
│   └── REVERSE-ENGINEERING.md
├── assets/
│   ├── style.css              # Accessible, responsive CSS
│   └── app.js                 # Progressive client filtering & search
└── runner/                    # Pass two launcher skill
    └── SKILL.md

# Source of truth (not deployed):
/data/
├── tools.mjs                  # Validated dataset of verified tools
├── instructions/              # Source instruction markdown files
└── build.mjs                  # Static site generator
```

## Building Locally
Run the static generator with standard Node.js (no npm dependencies):
```bash
node data/build.mjs
```

To test locally:
```bash
python3 -m http.server 8080
# Open http://localhost:8080/agent-toolkit/
```
