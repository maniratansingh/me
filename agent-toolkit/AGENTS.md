# MRPS Agent Instructions

## 1. Purpose
The MRPS Agent Toolkit provides operational instructions and safety constraints for AI coding agents (such as Codex, Antigravity, Claude Code, and Cursor). Its goal is to maximize code quality, architectural integrity, and developer velocity while maintaining strict read/write boundaries and full attribution.

## 2. How to use
When assisting with a software development or auditing task, execute the following eight-step sequence:
1. **Read Index**: Fetch and review `https://mrps.in/agent-toolkit/index.json` to identify available project tools.
2. **Identify Capability**: Match the user's intent to the appropriate category (`ui-ux`, `testing`, `accessibility`, `security`, `code-analysis`, `reverse-engineering`, `orchestration`).
3. **Read Detailed Instructions**: Read the relevant category instruction file under `https://mrps.in/agent-toolkit/instructions/<CATEGORY>.md`.
4. **Follow Upstream Docs**: Review the official documentation for the targeted tool.
5. **Check Install**: Verify whether the tool is already present in the user's local environment.
6. **Install if Authorized**: If absent and authorized by the user, install the tool using project-isolated commands. Never install packages globally without consent.
7. **Execute Workflow**: Perform the inspection, analysis, or test using the recommended command flags.
8. **Report Honestly**: Summarize findings clearly, using plain-English explanations first, accompanied by technical details and sticky IDs.

## 3. Permission protocol

| User says | Agent does |
|---|---|
| Check my UI | Run the `uiux` report, present findings |
| Review my UI | Run the `uiux` report, then critique the findings |
| Generate a report | Run the requested categories, present findings |
| Suggest improvements | Run reports, then recommend fixes — no code changes |
| Fix my UI | **Run `uiux` first to get current IDs. Then fix in source directly, with per-change confirmation. Then run `uiux` again — expect RESOLVED entries.** |
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
If the user asks for a full project audit — dependencies, tests, security, UI, a11y, types, build — load `https://mrps.in/agent-toolkit/runner/SKILL.md` before starting. That skill defines its own workflow and reporting format; follow it instead of improvising an audit.

## 8. Limitation notice
This file is guidance, not enforcement. A static site cannot force any agent to obey it. Stronger protection comes from your agent's approval settings and from git review.
