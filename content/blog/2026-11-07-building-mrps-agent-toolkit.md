---
title: "Building MRPS Agent Toolkit: A Curated Directory and Read-Only Auditor for Coding Agents"
description: "Why I built MRPS Agent Toolkit — curating real open-source tools with strict read/write boundaries, honest attribution, and a directory for coding agents."
date: 2026-11-07
tags: [ai, agents, tooling, reflection, personal]
section: blog
parent_link: "/blog/"
parent_text: "Posts"
---

AI coding assistants are becoming standard in modern development workflows. Whether using Codex, Antigravity, Claude Code, or Cursor, agents can write, edit, and refactor code at incredible speeds. But speed without boundaries is dangerous: agents often over-reach, hallucinate packages, silently rewrite configuration files, or perform destructive operations when all you asked for was a simple inspection.

To solve this, I built **[MRPS Agent Toolkit](/agent-toolkit/)** ([project repository](https://github.com/maniratansingh/me)).

Here are my thoughts on why I built it, how it works, and the core rules that guide it.

---

## 1. A Directory, Not a Replacement

There is an unfortunate tendency in AI tooling to wrap, fork, or disguise existing open-source work behind shiny new names. I believe in giving credit where it is due.

The MRPS Agent Toolkit is strictly a **directory** of existing, battle-tested open-source tools and agent skills:
- **[Impeccable](https://github.com/pbakaus/impeccable)** by Paul Bakaus for UI/UX design vocabulary and anti-slop frontend critiques.
- **[Playwright](https://github.com/microsoft/playwright)** by Microsoft for end-to-end browser testing.
- **[axe-core](https://github.com/dequelabs/axe-core)** by Deque Systems for automated accessibility compliance.
- **[Trivy](https://github.com/aquasecurity/trivy)** by Aqua Security for vulnerability and secret scanning.
- **[Obscura](https://github.com/h4ckf0r0day/obscura)** by h4ckf0r0day for headless browser infrastructure.
- **[Graphify](https://github.com/Graphify-Labs/graphify)** by Graphify Labs for AST codebase knowledge graphs.
- **[REA](https://github.com/morluto/rea)** by Morluto for universal reverse engineering via MCP.

Every entry links directly to its real GitHub repository, honors its original license, and credits its creators. Nothing is forked or rehosted.

You can always use any of these tools individually. By clicking the link to each tool, you go directly to the original author's repository and can use their kit independently in whatever manner you prefer. 

The MRPS Agent Toolkit is simply a connector to bring them together into a **unified workflow** when you want an automated, coordinated project audit.

---

## 2. The Non-Negotiable Write Boundary

The biggest issue with agent audits is write boundary violations. When you ask an agent to "audit my project", it shouldn't modify your `package.json`, rewrite your source code, or run auto-fix flags.

In the toolkit, the rule is simple: **Prepare the environment, never change the project.**

- **Allowed**: Installing declared dependencies (`npm ci`, `pip install -r requirements.txt`), creating local isolation environments (`.venv/`, `node_modules/`), running non-destructive audit commands, and writing reports strictly into `reports/`.
- **Forbidden**: Editing source files, altering manifests, running `--fix` or auto-patch scripts, committing or stashing git state, or performing global system installs.

If an issue is found, the auditor documents it with a sticky ID (`sec-01`, `a11y-02`) and explains it in plain English. The user decides if and when to fix it.

---

## 3. Integrated Directly into mrps.in

Like the rest of this site, the toolkit follows the lightweight, dependency-free architecture of `mrps.in`:
- **Fully Static**: Zero databases, zero server-side runtimes, zero third-party scripts on load.
- **Pure System Styling**: Uses our standard **IBM Plex Sans** and **IBM Plex Mono** typography and fluid design tokens.
- **Accessible & Fast**: Works with JavaScript disabled, passes WCAG 2.2 AA contrast standards, and ships in under 50 KB gzipped.

Check out the live directory at **[/agent-toolkit/](/agent-toolkit/)** or browse the [Projects list](/projects/).
