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
  'orchestration'
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
  <!-- Fonts: IBM Plex (Google Fonts) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,200;0,400;0,600;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/style.css?v=2" />
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

const indexData = tools.map(t => ({
  id: t.id,
  name: t.name,
  category: t.category,
  kind: t.kind,
  summary: t.summary,
  repository: t.repository,
  mcpEndpoint: t.mcpEndpoint,
  license: t.license,
  instructions: t.instructions,
  lastVerified: t.lastVerified
}));
fs.writeFileSync(path.resolve(OUT_DIR, 'index.json'), JSON.stringify(indexData, null, 2), 'utf-8');

let llmsTxt = `# MRPS Agent Toolkit
> A curated collection of open-source tools and agent skills for coding agents.

This directory indexes verified open-source developer tools, CLI utilities, libraries, and agent skills. Every entry links to upstream sources and provides strict operational boundaries for coding agents.

## Core Documents
- [Agent Guidance](https://mrps.in/agent-toolkit/AGENTS.md): Operational protocols, permissions ladder, and honesty rules.
- [Capability Index](https://mrps.in/agent-toolkit/index.json): Machine-readable index of all capabilities.
- [Project Credits](https://mrps.in/agent-toolkit/CREDITS.md): Full attribution, repositories, and licenses.

## Tools
`;

for (const t of tools) {
  llmsTxt += `- [${t.name}](https://mrps.in/agent-toolkit/tools/${t.id}.html): ${t.summary} Category: ${t.category}. Kind: ${t.kind}. License: ${t.license}.\n`;
}

llmsTxt += `\n## Usage Instructions\n`;
const instFiles = fs.readdirSync(path.resolve(OUT_DIR, 'instructions')).filter(f => f.endsWith('.md')).sort();
for (const f of instFiles) {
  llmsTxt += `- [${f}](https://mrps.in/agent-toolkit/instructions/${f}): Category instructions and workflows for ${f.replace('.md', '')}.\n`;
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

## 1. Purpose
The MRPS Agent Toolkit provides operational instructions and safety constraints for AI coding agents (such as Codex, Antigravity, Claude Code, and Cursor). Its goal is to maximize code quality, architectural integrity, and developer velocity while maintaining strict read/write boundaries and full attribution.

## 2. How to use
When assisting with a software development or auditing task, execute the following eight-step sequence:
1. **Read Index**: Fetch and review \`https://mrps.in/agent-toolkit/index.json\` to identify available project tools.
2. **Identify Capability**: Match the user's intent to the appropriate category (\`ui-ux\`, \`testing\`, \`accessibility\`, \`security\`, \`code-analysis\`, \`reverse-engineering\`, \`orchestration\`).
3. **Read Detailed Instructions**: Read the relevant category instruction file under \`https://mrps.in/agent-toolkit/instructions/<CATEGORY>.md\`.
4. **Follow Upstream Docs**: Review the official documentation for the targeted tool.
5. **Check Install**: Verify whether the tool is already present in the user's local environment.
6. **Install if Authorized**: If absent and authorized by the user, install the tool using project-isolated commands. Never install packages globally without consent.
7. **Execute Workflow**: Perform the inspection, analysis, or test using the recommended command flags.
8. **Report Honestly**: Summarize findings clearly, using plain-English explanations first, accompanied by technical details and sticky IDs.

## 3. Permission protocol

| User says | Agent does |
|---|---|
| Check my UI | Run the \`uiux\` report, present findings |
| Review my UI | Run the \`uiux\` report, then critique the findings |
| Generate a report | Run the requested categories, present findings |
| Suggest improvements | Run reports, then recommend fixes — no code changes |
| Fix my UI | **Run \`uiux\` first to get current IDs. Then fix in source directly, with per-change confirmation. Then run \`uiux\` again — expect RESOLVED entries.** |
| Check and ask me before fixing | Run reports, present IDs, ask which to fix, wait |

## 4. Defaults
When user intent is ambiguous, default to inspection and reporting only. Never modify source code, configuration files, or package manifests without explicit commands such as "fix", "apply", or "implement".

## 5. Honesty
Always report findings honestly and factually:
- Report failures as failures. Never claim a check passed that you did not actually execute.
- Clearly distinguish between *not configured*, *skipped*, and *passed*.
- If a check errors or exits with a non-zero code, document the exact command, exit code, and error trace.

## 6. Attribution
Always credit upstream project authors and repositories. Preserve license headers, copyright notices, and original attribution. Never fork, rename, or relicense upstream code.

## 7. Specialized skills
If the user asks for a full project audit — dependencies, tests, security, UI, a11y, types, build — load \`https://mrps.in/agent-toolkit/runner/SKILL.md\` before starting. That skill defines its own workflow and reporting format; follow it instead of improvising an audit.

## 8. Limitation notice
This file is guidance, not enforcement. A static site cannot force any agent to obey it. Stronger protection comes from your agent's approval settings and from git review.
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

Read the MRPS public agent instructions before performing the requested development task:
https://mrps.in/agent-toolkit/AGENTS.md

Read the capability index:
https://mrps.in/agent-toolkit/index.json

Follow the relevant tool-specific instructions, verify installation and compatibility,
and use the original upstream tools. Respect all inspection, reporting and
modification permissions. Do not modify files when the user only requests
inspection or reporting. Preserve upstream attribution and licences.</code></pre>
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
