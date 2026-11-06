export default [
  {
    id: "mrps-agent-runner",
    name: "MRPS Agent Launcher",
    category: "orchestration",
    kind: "skill",
    summary: "Read-only project auditor and runner for code, security, a11y, and UI checks.",
    description: "A static, read-only launcher skill for agent IDEs (Codex, Antigravity) that shows an audit menu, prepares isolated environments, runs selected checks, and writes structured reports with sticky IDs and plain-English summaries.",
    creator: {
      name: "Mani Ratan Singh",
      url: "https://mrps.in"
    },
    repository: "https://github.com/maniratansingh/me",
    mcpEndpoint: null,
    docsUrl: "https://mrps.in/agent-toolkit/runner/SKILL.md",
    license: "MIT",
    reasonForInclusion: "Serves as the primary inspection orchestrator for the toolkit, ensuring agents run audits without modifying user source code.",
    instructions: "/agent-toolkit/instructions/GLOBAL.md",
    setup: "Load https://mrps.in/agent-toolkit/runner/SKILL.md as a skill in your agent",
    tags: ["orchestration", "auditor", "runner", "skills", "checks"],
    lastVerified: "2026-11-07",
    agentInstructions: `Tool: MRPS Agent Launcher
When to use: Whenever the user asks for a project audit, or wants to run UI, security, a11y, tests, deps, or build checks. Before trusting or shipping a project.
When NOT to use: For single-file edits, explanations, or quick fixes. The launcher audits; it does not modify source.
Invocation: Load https://mrps.in/agent-toolkit/runner/SKILL.md as a skill, or paste its contents into your agent instructions. No executable — you, the agent, are the runtime.
Rules:
- Before you invoke anything, state what you intend to do and why. Do not act until the user confirms. If a rule is ambiguous, ask — do not guess.
- Never modify source, config, or manifests. Install declared dependencies and the tools a selected category needs, run the checks, write reports under reports/. Nothing else.
- Show the menu immediately on load; do not wait to be asked.
- Present the plan and wait for y/N before any install or any check.
- Read the prior report and _toolchain.json before writing a new one; preserve sticky IDs and label findings NEW / STILL OPEN / RESOLVED / NOT CHECKED.
- Every report contains a plain-English block and a changelog block above the technical table. Never omit either.
- Address findings only by their IDs (e.g. uiux-03); never summarize them away.
- Never mark a check as passed that was skipped, unconfigured, or errored.
- Never re-execute checks to produce a filtered or historical view; read the existing files.
- Append to CHANGELOG.md after every run — one line per category per run.`,
    installedVersion: null,
    latestRelease: null,
    lastChecked: null
  },
  {
    id: "impeccable",
    name: "Impeccable",
    category: "ui-ux",
    kind: "skill",
    summary: "The design vocabulary and UI critique system for coding agents.",
    description: "An agent skill providing frontend design critique, spacing rhythm standards, and visual polish rules to prevent AI slop and ensure intentional interface design.",
    creator: {
      name: "Paul Bakaus",
      url: "https://github.com/pbakaus"
    },
    repository: "https://github.com/pbakaus/impeccable",
    mcpEndpoint: null,
    docsUrl: "https://github.com/pbakaus/impeccable#readme",
    license: "Apache-2.0",
    reasonForInclusion: "Provides elite frontend visual vocabulary and critique rules directly into agent instructions.",
    instructions: "/agent-toolkit/instructions/UI-UX.md",
    setup: "Load https://github.com/pbakaus/impeccable into your agent instructions",
    tags: ["ui-ux", "design", "critique", "frontend", "polish"],
    lastVerified: "2026-11-07",
    agentInstructions: `Tool: Impeccable
When to use: Use when designing, styling, reviewing, or critiquing frontend web interfaces, component layouts, and design token hierarchies.
When NOT to use: Do not use for testing backend logic, inspecting database schemas, or debugging low-level memory usage.
Invocation: Reference Impeccable skill instructions when formulating UI reviews or component refactorings.
Rules:
- Before you invoke anything, state what you intend to do and why. Do not act until the user confirms. If a rule is ambiguous, ask — do not guess.
- Critique visual weight, alignment, and responsiveness before proposing code modifications.
- Do not apply modifications to source code unless the user explicitly requests fixes.
- Enforce strict 4pt/8pt spacing rhythm and prevent uncurated, unvalidated color selections.`,
    installedVersion: null,
    latestRelease: null,
    lastChecked: null
  },
  {
    id: "obscura",
    name: "Obscura",
    category: "testing",
    kind: "app",
    summary: "High-performance Rust-based headless browser for AI agents and web scraping.",
    description: "A fast, lightweight headless browser written in Rust with Chrome DevTools Protocol (CDP) and MCP server integration, designed as a stealthy, resource-efficient alternative to Chromium for agent web interactions.",
    creator: {
      name: "h4ckf0r0day",
      url: "https://github.com/h4ckf0r0day"
    },
    repository: "https://github.com/h4ckf0r0day/obscura",
    mcpEndpoint: null,
    docsUrl: "https://github.com/h4ckf0r0day/obscura#readme",
    license: "Apache-2.0",
    reasonForInclusion: "Offers lightweight, fast headless browser infrastructure that agents can drive directly without heavy browser dependencies.",
    instructions: "/agent-toolkit/instructions/TESTING.md",
    setup: "cargo install obscura",
    tags: ["browser", "headless", "rust", "scraping", "cdp"],
    lastVerified: "2026-11-07",
    agentInstructions: `Tool: Obscura
When to use: Use when an agent needs a fast, lightweight headless browser to navigate web pages, inspect DOM elements, or interact over CDP without launching heavy Chromium instances.
When NOT to use: Do not use as a static code scanner or repository finding generator; Obscura is headless browser infrastructure.
Invocation: Run obscura via CLI or connect via CDP or MCP server configuration.
Rules:
- Before you invoke anything, state what you intend to do and why. Do not act until the user confirms. If a rule is ambiguous, ask — do not guess.
- Restrict browser automation to user-specified local or remote test targets.
- Do not bypass authentication mechanisms or access controls on target sites.
- Close browser sessions cleanly to prevent dangling background processes.`,
    installedVersion: null,
    latestRelease: null,
    lastChecked: null
  },
  {
    id: "playwright",
    name: "Playwright",
    category: "testing",
    kind: "library",
    summary: "Reliable end-to-end multi-browser testing framework for modern web applications.",
    description: "Playwright enables reliable end-to-end testing across Chromium, Firefox, and WebKit with auto-wait assertions, network mocking, and cross-platform browser automation.",
    creator: {
      name: "Microsoft",
      url: "https://github.com/microsoft"
    },
    repository: "https://github.com/microsoft/playwright",
    mcpEndpoint: null,
    docsUrl: "https://playwright.dev",
    license: "Apache-2.0",
    reasonForInclusion: "The industry standard for deterministic, automated browser integration and end-to-end web testing.",
    instructions: "/agent-toolkit/instructions/TESTING.md",
    setup: "npm init playwright@latest",
    tags: ["testing", "e2e", "browser", "automation", "integration"],
    lastVerified: "2026-11-07",
    agentInstructions: `Tool: Playwright
When to use: Use when running automated browser test suites, executing end-to-end regression tests, or generating trace recordings for frontend debugging.
When NOT to use: Do not use for simple unit tests of pure algorithmic functions where Jest or Vitest executes significantly faster.
Invocation: Execute via npx playwright test or project test scripts.
Rules:
- Before you invoke anything, state what you intend to do and why. Do not act until the user confirms. If a rule is ambiguous, ask — do not guess.
- Always run tests in headless mode unless the user explicitly requests a headed browser window.
- Never modify test expectations to artificially pass a failing assertion without user consent.
- Report all test failures with exact assertion details and file locations.`,
    installedVersion: null,
    latestRelease: null,
    lastChecked: null
  },
  {
    id: "axe-core",
    name: "axe-core",
    category: "accessibility",
    kind: "library",
    summary: "Automated accessibility testing engine for HTML and web applications.",
    description: "The standard automated accessibility engine that evaluates web applications against WCAG 2.0, 2.1, and 2.2 Level A and AA standards with zero false positives.",
    creator: {
      name: "Deque Systems",
      url: "https://github.com/dequelabs"
    },
    repository: "https://github.com/dequelabs/axe-core",
    mcpEndpoint: null,
    docsUrl: "https://github.com/dequelabs/axe-core#readme",
    license: "MPL-2.0",
    reasonForInclusion: "The definitive benchmark for programmatic, rule-based accessibility violation detection.",
    instructions: "/agent-toolkit/instructions/ACCESSIBILITY.md",
    setup: "npm install -D @axe-core/cli",
    tags: ["accessibility", "a11y", "wcag", "audit", "compliance"],
    lastVerified: "2026-11-07",
    agentInstructions: `Tool: axe-core
When to use: Use when auditing web pages, templates, and rendered components for WCAG 2.1/2.2 AA accessibility violations, color contrast, and ARIA roles.
When NOT to use: Do not assume 100% test coverage from automated checks; manual keyboard and screen reader verification is still required.
Invocation: Execute using npx @axe-core/cli <target-url> or via test framework bindings.
Rules:
- Before you invoke anything, state what you intend to do and why. Do not act until the user confirms. If a rule is ambiguous, ask — do not guess.
- Group and report findings strictly by impact severity (critical, serious, moderate, minor).
- Do not modify source templates or ARIA attributes without presenting the proposed changes and obtaining user confirmation.
- Clearly differentiate between automated rule violations and warnings requiring manual review.`,
    installedVersion: null,
    latestRelease: null,
    lastChecked: null
  },
  {
    id: "trivy",
    name: "Trivy",
    category: "security",
    kind: "cli",
    summary: "Comprehensive security scanner for vulnerabilities, secrets, and misconfigurations.",
    description: "A comprehensive, fast vulnerability scanner by Aqua Security for containers, file systems, Git repositories, virtual machine images, and software bills of materials (SBOM).",
    creator: {
      name: "Aqua Security",
      url: "https://github.com/aquasecurity"
    },
    repository: "https://github.com/aquasecurity/trivy",
    mcpEndpoint: null,
    docsUrl: "https://aquasecurity.github.io/trivy/",
    license: "Apache-2.0",
    reasonForInclusion: "High-speed, multi-ecosystem vulnerability and secret scanning with comprehensive CVE databases.",
    instructions: "/agent-toolkit/instructions/SECURITY.md",
    setup: "curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin",
    tags: ["security", "vulnerabilities", "cve", "scanner", "secrets"],
    lastVerified: "2026-11-07",
    agentInstructions: `Tool: Trivy
When to use: Use when auditing project repositories, lockfiles, and container images for known security vulnerabilities (CVEs), leaked secrets, or configuration errors.
When NOT to use: Do not use for penetration testing or attacking running web applications.
Invocation: Run trivy fs --severity HIGH,CRITICAL . or trivy repo <url>.
Rules:
- Before you invoke anything, state what you intend to do and why. Do not act until the user confirms. If a rule is ambiguous, ask — do not guess.
- Always run scans in read-only mode without executing automated patch scripts.
- Never print exposed raw secrets or private keys into public conversation logs or reports.
- State whether a fixed package version is available when reporting vulnerability findings.`,
    installedVersion: null,
    latestRelease: null,
    lastChecked: null
  },
  {
    id: "graphify",
    name: "Graphify",
    category: "code-analysis",
    kind: "skill",
    summary: "Codebase knowledge graph generator with deterministic AST parsing.",
    description: "Turns any codebase, including documentation, SQL schemas, and configs, into a queryable knowledge graph. Provides local deterministic AST parsing with every edge explained without requiring external vector databases.",
    creator: {
      name: "Graphify Labs",
      url: "https://github.com/Graphify-Labs"
    },
    repository: "https://github.com/Graphify-Labs/graphify",
    mcpEndpoint: null,
    docsUrl: "https://github.com/Graphify-Labs/graphify#readme",
    license: "Apache-2.0",
    reasonForInclusion: "Transforms unfamiliar or complex multi-language repositories into structured, queryable knowledge graphs for agent comprehension.",
    instructions: "/agent-toolkit/instructions/CODE-ANALYSIS.md",
    setup: "uv tool install graphifyy && graphify install",
    tags: ["code-analysis", "ast", "knowledge-graph", "codebase", "architecture"],
    lastVerified: "2026-11-07",
    agentInstructions: `Tool: Graphify
When to use: Use when exploring architecture, tracing complex cross-file dependency graphs, or onboarding to a new codebase.
When NOT to use: Do not use as a fast single-file syntax linter or typechecker.
Invocation: Run uv tool install graphifyy && graphify install, then execute /graphify . in your agent.
Rules:
- Before you invoke anything, state what you intend to do and why. Do not act until the user confirms. If a rule is ambiguous, ask — do not guess.
- Graphify is an architectural analysis skill; it does not produce scan issue lists for the launcher.
- Run analysis strictly within the project boundary and store outputs in graphify-out/.
- Do not alter source code or configuration files during graph generation.`,
    installedVersion: null,
    latestRelease: null,
    lastChecked: null
  },
  {
    id: "rea",
    name: "REA",
    category: "reverse-engineering",
    kind: "mcp-server",
    summary: "Universal reverse engineering MCP server for binaries, runtimes, and application behavior.",
    description: "An MCP server enabling agents to reverse engineer compiled applications, native binaries, Electron apps, Android APKs, and runtime behavior with deep inspection and decompilation capabilities.",
    creator: {
      name: "Morluto",
      url: "https://github.com/morluto"
    },
    repository: "https://github.com/morluto/rea",
    mcpEndpoint: "npx -y rea-agents@latest",
    docsUrl: "https://github.com/morluto/rea/blob/main/docs/mcp-contracts.md",
    license: "MIT",
    reasonForInclusion: "Provides deep binary, package, and runtime reverse engineering capabilities through standardized Model Context Protocol tools.",
    instructions: "/agent-toolkit/instructions/REVERSE-ENGINEERING.md",
    setup: "npx rea-agents setup",
    tags: ["reverse-engineering", "mcp-server", "binary-analysis", "decompilation"],
    lastVerified: "2026-11-07",
    agentInstructions: `Tool: REA
When to use: Use when analyzing compiled binaries, APKs, Electron apps, or closed-source runtime behavior where source code is unavailable.
When NOT to use: Do not use for ordinary source-code architecture reviews when clean source code is already present.
Invocation: Register REA as an MCP server using npx -y rea-agents@latest.
Rules:
- Before you invoke anything, state what you intend to do and why. Do not act until the user confirms. If a rule is ambiguous, ask — do not guess.
- Restrict analysis to explicitly provided target files or processes.
- Never modify or patch target binaries during analysis.
- Preserve evidence trails and distinguish between observed factual behavior and decompiled inferences.`,
    installedVersion: null,
    latestRelease: null,
    lastChecked: null
  }
];
