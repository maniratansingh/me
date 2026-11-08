# MRPS Agent Instructions

## 1. What this is
A read-only audit protocol for AI coding agents (Codex, Antigravity, Claude Code, Cursor).

It applies when the user asks to **check, audit, review, scan, or report** on a project:
UI, accessibility, security, dependencies, tests, code structure, or build.

It does **not** apply to routine edits, explanations, refactors, or quick fixes. For those,
skip this file entirely — loading an audit catalog before renaming a variable is waste.

## 2. Use the index, never a guessed URL
Every category has exactly one instruction file. Read it from the `instructionFile` field
of the matching entry in `https://mrps.in/agent-toolkit/index.json`.

Do **not** build the path from the category name. They are not the same string:

| Category | Instruction file |
|---|---|
| `ui-ux` | `UI-UX.md` |
| `orchestration` | `GLOBAL.md` |
| `code-analysis` | `CODE-ANALYSIS.md` |
| `reverse-engineering` | `REVERSE-ENGINEERING.md` |
| `accessibility` | `ACCESSIBILITY.md` |
| `security` | `SECURITY.md` |
| `testing` | `TESTING.md` |
| `comprehensive` | `COMPREHENSIVE.md` |

Full URL: `https://mrps.in/agent-toolkit/instructions/` + that filename.
If the fetch fails, stop and ask the user for the local copy. Never improvise a toolset.

## 3. The loop
Run these in order. Steps 1–4 are reads; steps 5–8 act.

0. **Read the index** — `https://mrps.in/agent-toolkit/index.json`.
1. **Pick categories** — match the user's intent to one or more categories. If unclear, ask.
2. **Read the instruction file** — from `instructionFile`, per §2.
3. **Read upstream docs** — only the section needed for the command you will run.
4. **Check install** — is the tool present, and at a usable version?
5. **Plan and gate** — state the exact commands and any installs, then wait for `y`/`N`.
6. **Execute** — run the checks. Read-only. No fix flags.
7. **Write the report** — to `reports/<slug>/<runId>.md`. Never to the project root.
8. **Report the delta** — `+N new · N still open · N resolved · N not checked`.

If a tool is absent and the user has not authorized installing it, record
`NOT CHECKED` with the install command in the report. Do not skip silently.

## 4. Capability map

| Category | Tool | ID prefix | Report slug | Produces findings |
|---|---|---|---|---|
| orchestration | MRPS Agent Launcher | `run` | `run` | no |
| ui-ux | Impeccable | `uiux` | `uiux` | yes (critique) |
| testing | Playwright | `test` | `tests` | yes |
| accessibility | axe-core | `a11y` | `a11y` | yes |
| security | Trivy | `sec` | `security` | yes |
| code-analysis | Graphify + project linters | `code` | `code` | no list (delegated lint) |
| reverse-engineering | REA | `rev` | `reverse` | no list |
| comprehensive | Cloudflare Security Audit | `audit` | `comprehensive` | yes (source-level) |

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
re-run the same check. If a finding is not `RESOLVED`, report the failure — never claim
success without a re-run.

## 6. Write boundary

**Allowed** — install declared dependencies (`npm ci`, `pip install -r requirements.txt`),
create isolation dirs (`.venv/`, `node_modules/`), run non-destructive checks, write only
under `reports/` and `_toolchain.json`, start a local dev server if a check needs one
(announce it in the plan).

**Forbidden** — editing source, tests, config, or manifests; `--fix`/`--write`/autofix flags;
`git add`/`commit`/`stash`/`checkout`/`reset`; global installs; `sudo`; writing outside
the project; scanning production or hosts the user does not own.

## 7. Report contract

```
reports/
  CHANGELOG.md                  one line per category per run
  <slug>/
    <runId>.md                  this run's report
    _toolchain.json             tool + version + command, per category
```

`<runId>` is UTC: `YYYY-MM-DDTHH-MM-SSZ`.

Read the prior report and `_toolchain.json` **before** writing a new one. Retain every
prior ID. New findings take the next free integer for that prefix — never renumber, never
reuse a resolved ID.

Every report has this shape:

```markdown
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
```

Status vocabulary: `NEW` · `STILL OPEN` · `RESOLVED` · `NOT CHECKED`.
Severity: `C` · `H` · `M` · `L` (Critical, High, Medium, Low).

## 8. Honesty
- Report failures as failures. Never claim a check passed that you did not execute.
- Every finding needs **Evidence**: rule ID, `file:line`, selector, or screenshot path.
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
If a scan surfaces a credential, key, or token: record `file:line`, the rule ID, and a
masked prefix (`AKIA…****`) only. Never print the full value in chat, a report, or a
commit message. Recommend rotation; never attempt to use it.

## 11. Attribution
Credit upstream authors and repositories. Preserve license headers, copyright notices, and
original attribution. Never fork, rename, or relicense upstream code. Full list:
`https://mrps.in/agent-toolkit/CREDITS.md`.

## 12. Full workflow
For a multi-category audit, or when the user asks for "the toolkit", load
`https://mrps.in/agent-toolkit/runner/SKILL.md`. It adds the audit menu, the confirmation
gate, the delta mechanics, and the per-category routing. If it conflicts with this file,
SKILL.md wins on workflow; this file wins on permissions and honesty.

## 13. Limitation notice
This file is guidance, not enforcement. A static site cannot force any agent to obey it.
Stronger protection comes from your agent's approval settings and from git review.
