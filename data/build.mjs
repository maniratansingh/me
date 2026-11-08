#!/usr/bin/env node

/**
 * MRPS Agent Toolkit — Static Site & Instruction Generator
 * Zero npm dependencies (node:fs, node:path only).
 * Inherits and integrates directly with mrps.in design system and layout.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// If invoked directly by Cloudflare (e.g. build command: node data/build.mjs),
// execute full site build via build.sh so all content and pandoc pages compile.
if (process.env.MRPS_BUILD_SH_RUNNING !== '1') {
  console.log('Invoked outside build.sh — executing full site build via build.sh...');
  execSync('bash build.sh', {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: { ...process.env, MRPS_BUILD_SH_RUNNING: '1' }
  });
  process.exit(0);
}

const DATA_DIR = path.resolve(ROOT_DIR, 'data');
const OUT_DIR = path.resolve(ROOT_DIR, 'agent-toolkit');
const SITE_OUT_DIR = path.resolve(ROOT_DIR, 'site', 'agent-toolkit');

// Load tools.mjs
const toolsPath = path.resolve(DATA_DIR, 'tools.mjs');
if (!fs.existsSync(toolsPath)) {
  console.error(`FATAL: tools.mjs not found at ${toolsPath}`);
  process.exit(1);
}

const { default: tools } = await import(`file://${toolsPath}`);

// Allowed constants
const ALLOWED_CATEGORIES = new Set([
  'ui-ux',
  'testing',
  'accessibility',
  'security',
  'code-analysis',
  'reverse-engineering',
  'orchestration',
  'comprehensive'
]);

const ALLOWED_KINDS = new Set([
  'mcp-server',
  'skill',
  'cli',
  'library',
  'prompt-pack',
  'app'
]);

const KIND_DISPLAY = {
  'mcp-server': 'MCP server',
  'skill': 'Skill',
  'cli': 'CLI',
  'library': 'Library',
  'prompt-pack': 'Prompt pack',
  'app': 'App'
};

const KIND_DEFINITIONS = {
  'mcp-server': 'Model Context Protocol server exposing tools to AI agents via standard protocol.',
  'skill': 'Instruction set and reference documentation loaded directly into an agent environment.',
  'cli': 'Standalone command-line utility run in terminal or subshell.',
  'library': 'Reusable software package imported or integrated into application code.',
  'prompt-pack': 'Curated collection of structured prompts and engineering guidelines.',
  'app': 'Standalone application or headless browser infrastructure.'
};

const REQUIRED_HEADINGS = [
  'Tool:',
  'When to use:',
  'When NOT to use:',
  'Invocation:',
  'Rules:'
];

// ==========================================
// 1. VALIDATION (Must fail loudly on errors)
// ==========================================
console.log('Validating tools data model...');
const seenIds = new Set();

for (const tool of tools) {
  const requiredFields = [
    'id', 'name', 'category', 'kind', 'summary', 'description',
    'creator', 'repository', 'license', 'reasonForInclusion',
    'instructions', 'tags', 'lastVerified', 'agentInstructions'
  ];

  for (const field of requiredFields) {
    if (!tool[field] || (typeof tool[field] === 'string' && tool[field].trim() === '')) {
      throw new Error(`Validation Error [${tool.id || 'unknown'}]: Missing or empty required field '${field}'`);
    }
  }

  if (!tool.creator.name || !tool.creator.url) {
    throw new Error(`Validation Error [${tool.id}]: creator must have 'name' and 'url'`);
  }

  if (seenIds.has(tool.id)) {
    throw new Error(`Validation Error: Duplicate tool id '${tool.id}'`);
  }
  seenIds.add(tool.id);

  if (!ALLOWED_CATEGORIES.has(tool.category)) {
    throw new Error(`Validation Error [${tool.id}]: Invalid category '${tool.category}'. Must be one of: ${[...ALLOWED_CATEGORIES].join(', ')}`);
  }

  if (!ALLOWED_KINDS.has(tool.kind)) {
    throw new Error(`Validation Error [${tool.id}]: Invalid kind '${tool.kind}'. Must be one of: ${[...ALLOWED_KINDS].join(', ')}`);
  }

  if (!tool.license || tool.license.trim() === '') {
    throw new Error(`Validation Error [${tool.id}]: License must not be empty`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(tool.lastVerified)) {
    throw new Error(`Validation Error [${tool.id}]: Invalid lastVerified date format '${tool.lastVerified}'. Expected YYYY-MM-DD`);
  }

  if (tool.kind === 'mcp-server') {
    if (!tool.mcpEndpoint || tool.mcpEndpoint.trim() === '') {
      throw new Error(`Validation Error [${tool.id}]: kind is 'mcp-server' but mcpEndpoint is not set`);
    }
  } else {
    if (tool.mcpEndpoint !== null) {
      throw new Error(`Validation Error [${tool.id}]: kind is '${tool.kind}' but mcpEndpoint is set to '${tool.mcpEndpoint}' (must be null)`);
    }
  }

  const inst = tool.agentInstructions;
  for (const heading of REQUIRED_HEADINGS) {
    if (!inst.includes(heading)) {
      throw new Error(`Validation Error [${tool.id}]: agentInstructions is missing required heading '${heading}'`);
    }
  }

  const rulesIndex = inst.indexOf('Rules:');
  const rulesSection = inst.slice(rulesIndex + 'Rules:'.length);
  const bulletCount = (rulesSection.match(/^\s*-\s+.+/gm) || []).length;
  if (bulletCount === 0) {
    throw new Error(`Validation Error [${tool.id}]: agentInstructions 'Rules:' section must contain at least one bullet starting with '-'`);
  }

  const instFileName = path.basename(tool.instructions);
  const candidateInstPaths = [
    path.resolve(DATA_DIR, 'instructions', instFileName),
    path.resolve(OUT_DIR, 'instructions', instFileName)
  ];
  const instExists = candidateInstPaths.some(p => fs.existsSync(p));
  if (!instExists) {
    throw new Error(`Validation Error [${tool.id}]: instructions target file '${instFileName}' does not exist in data/instructions/`);
  }
}

console.log(`Validation passed cleanly for ${tools.length} verified tools.`);

// Ensure output directories exist
fs.mkdirSync(path.resolve(OUT_DIR, 'tools'), { recursive: true });
fs.mkdirSync(path.resolve(OUT_DIR, 'instructions'), { recursive: true });
fs.mkdirSync(path.resolve(OUT_DIR, 'assets'), { recursive: true });

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Copy instructions
const dataInstDir = path.resolve(DATA_DIR, 'instructions');
if (fs.existsSync(dataInstDir)) {
  const instFiles = fs.readdirSync(dataInstDir);
  for (const f of instFiles) {
    if (f.endsWith('.md')) {
      fs.copyFileSync(
        path.resolve(dataInstDir, f),
        path.resolve(OUT_DIR, 'instructions', f)
      );
    }
  }
}

// Copy the launcher skill (runner/SKILL.md) — the executable contract agents load.
const dataSkillDir = path.resolve(DATA_DIR, 'skill');
if (fs.existsSync(dataSkillDir)) {
  fs.mkdirSync(path.resolve(OUT_DIR, 'runner'), { recursive: true });
  for (const f of fs.readdirSync(dataSkillDir)) {
    fs.copyFileSync(
      path.resolve(dataSkillDir, f),
      path.resolve(OUT_DIR, 'runner', f)
    );
  }
}

// Common Header & Footer HTML matching mrps.in exactly
const siteHeaderHtml = `
<header class="site-header">
  <div class="header-inner">
    <a class="site-title" href="/">MRPS</a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="/blog/">Posts</a>
      <a href="/projects/">Projects</a>
      <a href="/photos/">Photos</a>
    </nav>
  </div>
</header>
`;

const siteFooterHtml = `
<footer class="site-footer">
  <div class="footer-inner">
    <p class="footer-name"><a href="/">Mani Ratan Singh</a></p>
    <nav class="footer-nav" aria-label="Footer navigation">
      <a href="/blog/">Posts</a>
      <a href="/projects/">Projects</a>
      <a href="/photos/">Photos</a>
      <a href="/agent-toolkit/CREDITS.md">Credits</a>
      <a href="/agent-toolkit/AGENTS.md">AGENTS.md</a>
    </nav>
  </div>
</footer>
`;

const fontsHeadHtml = `
  <!-- Fonts: IBM Plex, self-hosted (no third-party stylesheet) -->
  <link rel="preload" href="/fonts/ibm-plex-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/css/style.css?v=3" />
  <link rel="stylesheet" href="/agent-toolkit/assets/style.css?v=3" />
  <link rel="icon" type="image/png" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨‍💻</text></svg>" />
`;

// ==========================================
// 2. BUILD tools/<id>.json & tools/<id>.html
// ==========================================
console.log('Generating tools detail pages and JSON files...');

for (const tool of tools) {
  const jsonPath = path.resolve(OUT_DIR, 'tools', `${tool.id}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(tool, null, 2), 'utf-8');

  function extractSection(heading, nextHeadings) {
    const idx = tool.agentInstructions.indexOf(heading);
    if (idx === -1) return '';
    let start = idx + heading.length;
    let end = tool.agentInstructions.length;
    for (const nh of nextHeadings) {
      const nIdx = tool.agentInstructions.indexOf(nh, start);
      if (nIdx !== -1 && nIdx < end) {
        end = nIdx;
      }
    }
    return tool.agentInstructions.slice(start, end).trim();
  }

  const whenToUse = extractSection('When to use:', ['When NOT to use:', 'Invocation:', 'Rules:']);
  const whenNotToUse = extractSection('When NOT to use:', ['Invocation:', 'Rules:']);
  const rulesRaw = extractSection('Rules:', []);
  const ruleBullets = (rulesRaw.match(/^\s*-\s+(.+)$/gm) || []).map(r => r.replace(/^\s*-\s+/, '').trim());

  const kindBadgeLabel = KIND_DISPLAY[tool.kind] || tool.kind;
  const kindDef = KIND_DEFINITIONS[tool.kind] || '';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.summary,
    "url": tool.repository,
    "applicationCategory": tool.category,
    "license": tool.license,
    "author": {
      "@type": "Person",
      "name": tool.creator.name,
      "url": tool.creator.url
    }
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(tool.name)} — MRPS Agent Toolkit</title>
  <meta name="description" content="${escapeHtml(tool.summary)}">
  <link rel="canonical" href="https://mrps.in/agent-toolkit/tools/${escapeHtml(tool.id)}.html">
  <meta property="og:title" content="${escapeHtml(tool.name)} — MRPS Agent Toolkit">
  <meta property="og:description" content="${escapeHtml(tool.summary)}">
  <meta property="og:url" content="https://mrps.in/agent-toolkit/tools/${escapeHtml(tool.id)}.html">
  <meta property="og:image" content="https://mrps.in/agent-toolkit/og.png">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(tool.name)} — MRPS Agent Toolkit">
  <meta name="twitter:description" content="${escapeHtml(tool.summary)}">
  <meta name="twitter:image" content="https://mrps.in/agent-toolkit/og.png">
${fontsHeadHtml}
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  ${siteHeaderHtml}

  <main id="main-content" class="toolkit-container">
    <div class="back-nav" style="margin-bottom: var(--s-md);">
      <a href="/agent-toolkit/" class="btn-back">← Back to Toolkit</a>
    </div>

    <div class="toolkit-detail-wrap">
      <header class="toolkit-detail-header">
        <div class="toolkit-detail-title-row">
          <h1>${escapeHtml(tool.name)}</h1>
          <span class="toolkit-badge badge-${escapeHtml(tool.kind)}">${escapeHtml(kindBadgeLabel)}</span>
        </div>
        <p class="toolkit-badge-def">${escapeHtml(kindDef)}</p>
      </header>

      <!-- 1. What it does -->
      <section class="toolkit-section">
        <h2>1. What it does</h2>
        <p>${escapeHtml(tool.description)}</p>
      </section>

      <!-- 2. Why MRPS selected it -->
      <section class="toolkit-section">
        <h2>2. Why MRPS selected it</h2>
        <p>${escapeHtml(tool.reasonForInclusion)}</p>
      </section>

      <!-- 3. Kind badge & definition -->
      <section class="toolkit-section">
        <h2>3. Tool Kind</h2>
        <p><strong>${escapeHtml(kindBadgeLabel)}</strong>: ${escapeHtml(kindDef)}</p>
      </section>

      <!-- 4. Original repository -->
      <section class="toolkit-section">
        <h2>4. Original repository</h2>
        <p><a href="${escapeHtml(tool.repository)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.repository)}</a></p>
      </section>

      <!-- 5. Official documentation -->
      <section class="toolkit-section">
        <h2>5. Official documentation</h2>
        <p><a href="${escapeHtml(tool.docsUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.docsUrl)}</a></p>
      </section>

      <!-- 6. Author and license -->
      <section class="toolkit-section">
        <h2>6. Author and license</h2>
        <p>Created by <a href="${escapeHtml(tool.creator.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.creator.name)}</a> under the <strong>${escapeHtml(tool.license)}</strong> license.</p>
      </section>

      <!-- 7. Installation (setup, copyable) -->
      <section class="toolkit-section">
        <h2>7. Installation</h2>
        ${tool.setup ? `
        <div class="toolkit-code-box">
          <button class="btn-primary-action copy-snippet-btn" data-target="setup-code" style="float:right;">Copy</button>
          <pre><code id="setup-code">${escapeHtml(tool.setup)}</code></pre>
        </div>` : `<p>No separate installation required.</p>`}
      </section>

      <!-- 8. When the AI should use it -->
      <section class="toolkit-section">
        <h2>8. When the AI should use it</h2>
        <p>${escapeHtml(whenToUse)}</p>
      </section>

      <!-- 9. When the AI should not use it -->
      <section class="toolkit-section">
        <h2>9. When the AI should not use it</h2>
        <p>${escapeHtml(whenNotToUse)}</p>
      </section>

      <!-- 10. What the AI must not do -->
      <section class="toolkit-section">
        <h2>10. What the AI must not do</h2>
        <ul>
          ${ruleBullets.map(b => `<li>${escapeHtml(b)}</li>`).join('\n          ')}
        </ul>
      </section>

      <!-- 11. MRPS usage instructions link -->
      <section class="toolkit-section">
        <h2>11. MRPS usage instructions</h2>
        <p><a href="${escapeHtml(tool.instructions)}">Read ${escapeHtml(path.basename(tool.instructions))}</a></p>
      </section>

      <!-- 12. Last verified -->
      <section class="toolkit-section">
        <h2>12. Last verified</h2>
        <p>Verified against live repository on: <strong>${escapeHtml(tool.lastVerified)}</strong></p>
      </section>

      <!-- 13. Back to directory -->
      <nav class="toolkit-section" style="margin-top:var(--s-lg); border-top:1px solid var(--border); padding-top:var(--s-md);">
        <a href="/agent-toolkit/" class="btn-back">← Back to Toolkit Directory</a>
      </nav>

      <details class="toolkit-disclosure">
        <summary>View Complete Agent Constraint Sheet</summary>
        <div class="disclosure-inner">${escapeHtml(tool.agentInstructions)}</div>
      </details>
    </div>
  </main>

  ${siteFooterHtml}
  <script src="/agent-toolkit/assets/app.js" defer></script>
</body>
</html>`;

  const htmlPath = path.resolve(OUT_DIR, 'tools', `${tool.id}.html`);
  fs.writeFileSync(htmlPath, html, 'utf-8');
}

// ==========================================
// 3. CORE ASSETS (index.json, llms.txt, CREDITS.md, AGENTS.md)
// ==========================================
console.log('Generating core assets (index.json, llms.txt, CREDITS.md, AGENTS.md)...');

// Canonical routing metadata. One source of truth for the id prefix, report slug,
// and instruction file an agent must load for a given category.
const CATEGORY_META = {
  'orchestration':        { idPrefix: 'run',   reportSlug: 'run',      instructionFile: 'GLOBAL.md',               producesFindings: false },
  'ui-ux':                { idPrefix: 'uiux',  reportSlug: 'uiux',     instructionFile: 'UI-UX.md',                producesFindings: true  },
  'testing':              { idPrefix: 'test',  reportSlug: 'tests',    instructionFile: 'TESTING.md',              producesFindings: true  },
  'accessibility':        { idPrefix: 'a11y',  reportSlug: 'a11y',     instructionFile: 'ACCESSIBILITY.md',        producesFindings: true  },
  'security':             { idPrefix: 'sec',   reportSlug: 'security', instructionFile: 'SECURITY.md',             producesFindings: true  },
  'code-analysis':        { idPrefix: 'code',  reportSlug: 'code',     instructionFile: 'CODE-ANALYSIS.md',        producesFindings: false },
  'reverse-engineering':  { idPrefix: 'rev',   reportSlug: 'reverse',  instructionFile: 'REVERSE-ENGINEERING.md',  producesFindings: false },
  'comprehensive':        { idPrefix: 'audit', reportSlug: 'comprehensive', instructionFile: 'COMPREHENSIVE.md',   producesFindings: true  }
};

const indexData = tools.map(t => {
  const meta = CATEGORY_META[t.category] || {};
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    kind: t.kind,
    summary: t.summary,
    repository: t.repository,
    mcpEndpoint: t.mcpEndpoint,
    license: t.license,
    instructions: t.instructions,
    // Resolved filename so agents never have to assemble a URL from the category id.
    instructionFile: meta.instructionFile || null,
    idPrefix: meta.idPrefix || null,
    reportSlug: meta.reportSlug || null,
    producesFindings: t.producesFindings ?? meta.producesFindings ?? true,
    setup: t.setup || null,
    docsUrl: t.docsUrl || null,
    lastVerified: t.lastVerified
  };
});
fs.writeFileSync(path.resolve(OUT_DIR, 'index.json'), JSON.stringify(indexData, null, 2), 'utf-8');

let llmsTxt = `# MRPS Agent Toolkit
> A curated collection of open-source tools and agent skills for coding agents.

This directory indexes verified open-source developer tools, CLI utilities, libraries, and agent skills. Every entry links to upstream sources and provides strict operational boundaries for coding agents.

Start here if you are an agent asked to audit a project: read AGENTS.md, then load
runner/SKILL.md. Everything else is reference.

## Core Documents
- [Agent Guidance](https://mrps.in/agent-toolkit/AGENTS.md): Read-only audit protocol, permission ladder, report contract, honesty rules.
- [Launcher Skill](https://mrps.in/agent-toolkit/runner/SKILL.md): The full audit workflow an agent follows — menu, gate, report format, ID scheme.
- [Capability Index](https://mrps.in/agent-toolkit/index.json): Machine-readable index of all capabilities, with instruction file, id prefix, and report slug per tool.
- [Project Credits](https://mrps.in/agent-toolkit/CREDITS.md): Full attribution, repositories, and licenses.

## Tools
`;

for (const t of tools) {
  llmsTxt += `- [${t.name}](https://mrps.in/agent-toolkit/tools/${t.id}.html): ${t.summary} Category: ${t.category}. Kind: ${t.kind}. License: ${t.license}.\n`;
}

const INSTRUCTION_SUMMARIES = {
  'GLOBAL.md': 'Orchestration, permission ladder, report contract, and finding ID scheme.',
  'UI-UX.md': 'Visual hierarchy, spacing rhythm, responsive integrity, and UI critique evidence rules.',
  'TESTING.md': 'End-to-end tests with Playwright; Obscura as headless infrastructure, not a scanner.',
  'ACCESSIBILITY.md': 'WCAG 2.2 AA checks with axe-core, severity mapping, and required manual checks.',
  'SECURITY.md': 'Dependency CVEs, secrets, and misconfiguration with Trivy — plus redaction rules.',
  'CODE-ANALYSIS.md': 'Codebase knowledge graphs with Graphify; linting delegated to the project.',
  'REVERSE-ENGINEERING.md': 'Authorized artifact analysis with REA; never patch binaries.',
  'COMPREHENSIVE.md': 'Six-phase, source-level security audit with schema-validated, independently verified findings.'
};

llmsTxt += `\n## Usage Instructions\n`;
const instFiles = fs.readdirSync(path.resolve(OUT_DIR, 'instructions')).filter(f => f.endsWith('.md')).sort();
for (const f of instFiles) {
  const what = INSTRUCTION_SUMMARIES[f] || 'Category instructions and workflows.';
  llmsTxt += `- [${f}](https://mrps.in/agent-toolkit/instructions/${f}): ${what}\n`;
}

fs.writeFileSync(path.resolve(OUT_DIR, 'llms.txt'), llmsTxt, 'utf-8');

let creditsMd = `# Project Credits — MRPS Agent Toolkit

The MRPS Agent Toolkit is a curated index of exceptional open-source tools and agent skills. We are deeply grateful to the creators, maintainers, and communities behind these upstream projects.

| Tool | Creator | Repository | License | Last Verified |
| :--- | :--- | :--- | :--- | :--- |
`;

for (const t of tools) {
  creditsMd += `| [${t.name}](https://mrps.in/agent-toolkit/tools/${t.id}.html) | [${t.creator.name}](${t.creator.url}) | [${t.repository.replace('https://github.com/', '')}](${t.repository}) | ${t.license} | ${t.lastVerified} |\n`;
}

creditsMd += `\nMRPS Agent Toolkit is a directory. All projects remain the property of their creators under their respective licenses. No code is forked or rehosted.\n`;
fs.writeFileSync(path.resolve(OUT_DIR, 'CREDITS.md'), creditsMd, 'utf-8');

const agentsMd = `# MRPS Agent Instructions

## 1. What this is
A read-only audit protocol for AI coding agents (Codex, Antigravity, Claude Code, Cursor).

It applies when the user asks to **check, audit, review, scan, or report** on a project:
UI, accessibility, security, dependencies, tests, code structure, or build.

It does **not** apply to routine edits, explanations, refactors, or quick fixes. For those,
skip this file entirely — loading an audit catalog before renaming a variable is waste.

## 2. Use the index, never a guessed URL
Every category has exactly one instruction file. Read it from the \`instructionFile\` field
of the matching entry in \`https://mrps.in/agent-toolkit/index.json\`.

Do **not** build the path from the category name. They are not the same string:

| Category | Instruction file |
|---|---|
| \`ui-ux\` | \`UI-UX.md\` |
| \`orchestration\` | \`GLOBAL.md\` |
| \`code-analysis\` | \`CODE-ANALYSIS.md\` |
| \`reverse-engineering\` | \`REVERSE-ENGINEERING.md\` |
| \`accessibility\` | \`ACCESSIBILITY.md\` |
| \`security\` | \`SECURITY.md\` |
| \`testing\` | \`TESTING.md\` |
| \`comprehensive\` | \`COMPREHENSIVE.md\` |

Full URL: \`https://mrps.in/agent-toolkit/instructions/\` + that filename.
If the fetch fails, stop and ask the user for the local copy. Never improvise a toolset.

## 3. The loop
Run these in order. Steps 1–4 are reads; steps 5–8 act.

0. **Read the index** — \`https://mrps.in/agent-toolkit/index.json\`.
1. **Pick categories** — match the user's intent to one or more categories. If unclear, ask.
2. **Read the instruction file** — from \`instructionFile\`, per §2.
3. **Read upstream docs** — only the section needed for the command you will run.
4. **Check install** — is the tool present, and at a usable version?
5. **Plan and gate** — state the exact commands and any installs, then wait for \`y\`/\`N\`.
6. **Execute** — run the checks. Read-only. No fix flags.
7. **Write the report** — to \`reports/<slug>/<runId>.md\`. Never to the project root.
8. **Report the delta** — \`+N new · N still open · N resolved · N not checked\`.

If a tool is absent and the user has not authorized installing it, record
\`NOT CHECKED\` with the install command in the report. Do not skip silently.

## 4. Capability map

| Category | Tool | ID prefix | Report slug | Produces findings |
|---|---|---|---|---|
| orchestration | MRPS Agent Launcher | \`run\` | \`run\` | no |
| ui-ux | Impeccable | \`uiux\` | \`uiux\` | yes (critique) |
| testing | Playwright | \`test\` | \`tests\` | yes |
| accessibility | axe-core | \`a11y\` | \`a11y\` | yes |
| security | Trivy | \`sec\` | \`security\` | yes |
| code-analysis | Graphify + project linters | \`code\` | \`code\` | no list (delegated lint) |
| reverse-engineering | REA | \`rev\` | \`reverse\` | no list |
| comprehensive | Cloudflare Security Audit | \`audit\` | \`comprehensive\` | yes (source-level) |

Obscura and REA are infrastructure: they help you observe a target, they do not emit
finding lists. Do not invent findings to fill their section.

## 5. Permission ladder

Move only as far as the user asked. Never climb on your own.

1. **Inspect** — run checks and collect diagnostics. Zero writes to the project.
2. **Critique** — explain impact and priority.
3. **Recommend** — give the exact fix without applying it.
4. **Fix** — apply changes only after an explicit command such as "fix sec-01".

| User says | Level | Agent does |
|---|---|---|
| Check / audit my UI | Inspect | Run the uiux check, write the report, present findings |
| Review my UI | Critique | Inspect, then explain what matters and why |
| Suggest improvements | Recommend | Report, then propose exact fixes — no edits |
| Fix my UI | Fix | Run first to get current IDs → confirm the plan → fix → re-run → show RESOLVED |
| Check and ask before fixing | Inspect | Report, present IDs, ask which to fix, wait |
| Check my security / a11y / tests | Inspect | Same, with the matching category |

The same four levels apply to every category. "Check", "review", "audit", "generate a
report" and "suggest" are **never** Fix.

When entering Fix: one confirmation for the agreed list of IDs, then edit. After editing,
re-run the same check. If a finding is not \`RESOLVED\`, report the failure — never claim
success without a re-run.

## 6. Write boundary

**Allowed** — install declared dependencies (\`npm ci\`, \`pip install -r requirements.txt\`),
create isolation dirs (\`.venv/\`, \`node_modules/\`), run non-destructive checks, write only
under \`reports/\` and \`_toolchain.json\`, start a local dev server if a check needs one
(announce it in the plan).

**Forbidden** — editing source, tests, config, or manifests; \`--fix\`/\`--write\`/autofix flags;
\`git add\`/\`commit\`/\`stash\`/\`checkout\`/\`reset\`; global installs; \`sudo\`; writing outside
the project; scanning production or hosts the user does not own.

## 7. Report contract

\`\`\`
reports/
  CHANGELOG.md                  one line per category per run
  <slug>/
    <runId>.md                  this run's report
    _toolchain.json             tool + version + command, per category
\`\`\`

\`<runId>\` is UTC: \`YYYY-MM-DDTHH-MM-SSZ\`.

Read the prior report and \`_toolchain.json\` **before** writing a new one. Retain every
prior ID. New findings take the next free integer for that prefix — never renumber, never
reuse a resolved ID.

Every report has this shape:

\`\`\`markdown
# <slug> — <runId>

Prior: <prior runId | none (first run)>
Toolchain: <tool + version>
Delta: +N new · N still open · N resolved · N not checked

## What was found (plain English)
- **<id>** — <one sentence a non-engineer understands>. (<Severity>)

## What changed since last run
- <delta summary, or "First run.">

## Technical detail
| ID | Sev | Evidence | File | Rule | Status |

## Commands run
| Command | Exit | Note |

## Not checked
- <what was skipped and why> — or "None."

Generated by <agent name>. Read-only. No source files were modified.
Findings are advisory; the user decides what to fix.
\`\`\`

Status vocabulary: \`NEW\` · \`STILL OPEN\` · \`RESOLVED\` · \`NOT CHECKED\`.
Severity: \`C\` · \`H\` · \`M\` · \`L\` (Critical, High, Medium, Low).

## 8. Honesty
- Report failures as failures. Never claim a check passed that you did not execute.
- Every finding needs **Evidence**: rule ID, \`file:line\`, selector, or screenshot path.
  No evidence, no finding.
- Distinguish *not configured*, *skipped*, and *passed* — they are three different things.
- If a command exits non-zero, record the exact command, exit code, and error line.
- An empty category is a valid result. Do not manufacture findings.
- A delta is only meaningful between runs on the same major tool version. Say so if it changed.

## 9. Scope and authorization
Audit only projects the user owns or has explicitly authorized. Never point a scanner at
production, staging, or a third-party host without written permission. For reverse
engineering, only artifacts the user owns or whose license permits analysis. If the target
is ambiguous, stop and ask.

## 10. Secrets
If a scan surfaces a credential, key, or token: record \`file:line\`, the rule ID, and a
masked prefix (\`AKIA…****\`) only. Never print the full value in chat, a report, or a
commit message. Recommend rotation; never attempt to use it.

## 11. Attribution
Credit upstream authors and repositories. Preserve license headers, copyright notices, and
original attribution. Never fork, rename, or relicense upstream code. Full list:
\`https://mrps.in/agent-toolkit/CREDITS.md\`.

## 12. Full workflow
For a multi-category audit, or when the user asks for "the toolkit", load
\`https://mrps.in/agent-toolkit/runner/SKILL.md\`. It adds the audit menu, the confirmation
gate, the delta mechanics, and the per-category routing. If it conflicts with this file,
SKILL.md wins on workflow; this file wins on permissions and honesty.

## 13. Limitation notice
This file is guidance, not enforcement. A static site cannot force any agent to obey it.
Stronger protection comes from your agent's approval settings and from git review.
`;
fs.writeFileSync(path.resolve(OUT_DIR, 'AGENTS.md'), agentsMd, 'utf-8');

// ==========================================
// 4. BUILD index.html
// ==========================================
console.log('Generating index.html...');

const activeCategories = [...new Set(tools.map(t => t.category))].sort();
const activeKinds = [...new Set(tools.map(t => t.kind))].sort();

const itemListElements = tools.map((tool, idx) => ({
  "@type": "ListItem",
  "position": idx + 1,
  "name": tool.name,
  "url": `https://mrps.in/agent-toolkit/tools/${tool.id}.html`
}));

const indexJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "MRPS Agent Toolkit",
  "description": "A curated collection of open-source tools and agent skills for coding agents.",
  "url": "https://mrps.in/agent-toolkit/",
  "itemListElement": itemListElements
};

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MRPS Agent Toolkit · Tools for better AI development</title>
  <meta name="description" content="A curated collection of open-source tools and agent skills for coding agents. Every entry credits its original creator and links to the real source.">
  <link rel="canonical" href="https://mrps.in/agent-toolkit/">
  <meta property="og:title" content="MRPS Agent Toolkit · Tools for better AI development">
  <meta property="og:description" content="A curated collection of open-source tools and agent skills for coding agents. Crediting original creators.">
  <meta property="og:url" content="https://mrps.in/agent-toolkit/">
  <meta property="og:image" content="https://mrps.in/agent-toolkit/og.png">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="MRPS Agent Toolkit · Tools for better AI development">
  <meta name="twitter:description" content="A curated collection of open-source tools and agent skills for coding agents.">
  <meta name="twitter:image" content="https://mrps.in/agent-toolkit/og.png">
${fontsHeadHtml}
  <script type="application/ld+json">
${JSON.stringify(indexJsonLd, null, 2)}
  </script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  ${siteHeaderHtml}

  <main id="main-content" class="toolkit-container">
    <div class="back-nav" style="margin-bottom: var(--s-md);">
      <a href="/projects/" class="btn-back">← Back to Projects</a>
    </div>

    <section class="toolkit-hero">
      <div class="toolkit-eyebrow">MRPS Agent Toolkit · Public</div>
      <h1>Tools for better AI development.</h1>
      <p class="toolkit-hero-lede">
        A curated collection of modern, verified open-source tools and agent skills for coding agents. This is a directory and connector — not a fork or replacement for the projects it lists.
      </p>

      <div class="toolkit-note-box" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--toolkit-card-radius); padding:var(--s-md); margin-bottom:var(--s-md); max-width:var(--measure);">
        <p style="font-size:var(--step--1); color:var(--text); line-height:1.6; margin-bottom:var(--s-xs);">
          <strong>How this works:</strong> These represent the latest tools used across UI/UX, accessibility, security, testing, and code analysis. You can use any of them independently from their respective creators by clicking their direct GitHub links.
        </p>
        <p style="font-size:var(--step--1); color:var(--muted); line-height:1.6; margin:0;">
          If you want a <strong>unified workflow</strong>, running this toolkit connects and coordinates them together under strict read-only safety rules — auditing your project without modifying your source code, configuration, or manifests.
        </p>
      </div>

      <div class="toolkit-cta-box">
        <div class="toolkit-cta-header">
          <span class="toolkit-cta-title">Agent Prompt Setup</span>
          <button id="copy-prompt-btn" class="btn-primary-action" type="button" aria-label="Copy AI Setup Prompt">
            Copy AI Setup Prompt
          </button>
        </div>
        <pre class="prompt-preview-block"><code>MRPS Agent Toolkit — Setup Instructions

You are about to audit this project. Follow the MRPS read-only protocol.

1. Read the agent instructions:
https://mrps.in/agent-toolkit/AGENTS.md

2. Read the capability index:
https://mrps.in/agent-toolkit/index.json

3. Load the audit workflow:
https://mrps.in/agent-toolkit/runner/SKILL.md

Then: show the audit menu, wait for my confirmation, run only the checks I approve,
and write the report under reports/. Do not modify source, config, manifests, or git
state. Respect every inspection, reporting and modification permission. Preserve
upstream attribution and licences.</code></pre>
      </div>

      <!-- Raw Assets & Direct Downloads Panel -->
      <div class="toolkit-cta-box" style="margin-top: var(--s-md);">
        <div class="toolkit-cta-header">
          <span class="toolkit-cta-title">Direct Files &amp; Downloads</span>
        </div>
        <p style="font-size: var(--step--1); color: var(--muted); margin-bottom: var(--s-sm); line-height: 1.5;">
          For offline use or AI clients that cannot fetch URLs directly, copy the raw markdown/JSON or download the file directly:
        </p>

        <div style="display: flex; flex-direction: column; gap: var(--s-xs);">
          <!-- AGENTS.md -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--s-sm); padding: var(--s-xs) 0; border-bottom: 1px solid var(--border);">
            <span style="font-family: var(--toolkit-font-mono); font-size: var(--step--1); color: var(--text); font-weight: 600;">AGENTS.md</span>
            <div style="display: flex; gap: var(--s-xs); flex-shrink: 0; align-items: center;">
              <button type="button" class="btn-action-small copy-asset-btn" data-target="raw-agents-md">Copy Markdown</button>
              <a href="/agent-toolkit/AGENTS.md" download="AGENTS.md" class="btn-action-small-outline">Download</a>
            </div>
          </div>

          <!-- index.json -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--s-sm); padding: var(--s-xs) 0; border-bottom: 1px solid var(--border);">
            <span style="font-family: var(--toolkit-font-mono); font-size: var(--step--1); color: var(--text); font-weight: 600;">index.json</span>
            <div style="display: flex; gap: var(--s-xs); flex-shrink: 0; align-items: center;">
              <button type="button" class="btn-action-small copy-asset-btn" data-target="raw-index-json">Copy JSON</button>
              <a href="/agent-toolkit/index.json" download="index.json" class="btn-action-small-outline">Download</a>
            </div>
          </div>

          <!-- llms.txt -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--s-sm); padding: var(--s-xs) 0;">
            <span style="font-family: var(--toolkit-font-mono); font-size: var(--step--1); color: var(--text); font-weight: 600;">llms.txt</span>
            <div style="display: flex; gap: var(--s-xs); flex-shrink: 0; align-items: center;">
              <button type="button" class="btn-action-small copy-asset-btn" data-target="raw-llms-txt">Copy Text</button>
              <a href="/agent-toolkit/llms.txt" download="llms.txt" class="btn-action-small-outline">Download</a>
            </div>
          </div>
        </div>

        <!-- Hidden pre-loaded raw contents for instant copying -->
        <textarea id="raw-agents-md" style="display:none;" aria-hidden="true">${escapeHtml(agentsMd)}</textarea>
        <textarea id="raw-index-json" style="display:none;" aria-hidden="true">${escapeHtml(JSON.stringify(indexData, null, 2))}</textarea>
        <textarea id="raw-llms-txt" style="display:none;" aria-hidden="true">${escapeHtml(llmsTxt)}</textarea>
      </div>
    </section>

    <!-- Tools Grid -->
    <section class="toolkit-grid" aria-label="Tools Directory">
      ${tools.map(tool => {
        const repoDisplay = tool.repository.replace('https://github.com/', 'github.com/');

        return `
      <article class="toolkit-card" id="${escapeHtml(tool.id)}">
        <div class="toolkit-card-header">
          <h2 class="toolkit-card-title">
            <a href="/agent-toolkit/tools/${escapeHtml(tool.id)}.html">${escapeHtml(tool.name)}</a>
          </h2>
          <span class="toolkit-badge badge-${escapeHtml(tool.kind)}">${escapeHtml(KIND_DISPLAY[tool.kind] || tool.kind)}</span>
        </div>
        <p class="toolkit-card-summary">${escapeHtml(tool.summary)}</p>
        <div class="toolkit-card-meta">
          <div class="toolkit-card-meta-row">
            <span>By <a href="${escapeHtml(tool.creator.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.creator.name)}</a></span>
            <span>License: <strong>${escapeHtml(tool.license)}</strong></span>
          </div>
          <div class="toolkit-card-meta-row" style="margin-top:0.4rem;">
            <span><a href="${escapeHtml(tool.repository)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent); font-weight:600; text-decoration:underline;">GitHub: ${escapeHtml(repoDisplay)} ↗</a></span>
          </div>
          <div class="toolkit-card-meta-row" style="margin-top:0.35rem;">
            <a href="/agent-toolkit/tools/${escapeHtml(tool.id)}.html" style="font-weight:600;">View Rules &amp; Usage →</a>
          </div>
        </div>
      </article>`;
      }).join('\n')}
    </section>
  </main>

  ${siteFooterHtml}
  <script src="/agent-toolkit/assets/app.js" defer></script>
</body>
</html>`;

fs.writeFileSync(path.resolve(OUT_DIR, 'index.html'), indexHtml, 'utf-8');

// ==========================================
// 5. MIRROR TO site/agent-toolkit
// ==========================================
function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.resolve(src, entry.name);
    const destPath = path.resolve(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(path.resolve(ROOT_DIR, 'site'))) {
  console.log('Mirroring agent-toolkit to site/agent-toolkit...');
  copyDirRecursive(OUT_DIR, SITE_OUT_DIR);
}

console.log('Build completed successfully!');
