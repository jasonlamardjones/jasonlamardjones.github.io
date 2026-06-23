# 00A — Claude Code Full Task Prompt Gate

Use this control source for every task involving Claude Code, GitHub, repository files, branches, PRs, HTML/CSS/JS, Resource Hub pages, Resource Hub data, website analytics, America250 pages, or publishing workflow.

Do not provide a casual Claude/Claude Code prompt for these tasks.

Every Claude Code task prompt must use the full structure below.

---

## Required Prompt Structure

### 1. CLAUDE TASK SETTINGS

Every Claude Code prompt must begin with:

* Recommended environment: Claude Code
* Recommended model: Sonnet 4.6 if available, otherwise strongest available Claude coding/reasoning model
* Recommended effort: High for repo inspection, code edits, analytics, public-facing content, bilingual content, or boundary-sensitive tasks
* Thinking: On / extended thinking if available
* Reason: Explain why the task needs this model/effort level
* Mode: Inspection only / Edit approved / QA only / Commit approved / PR approved
* Conversation placement: Start fresh Claude Code session unless continuing the same exact branch/task

If model names or UI settings change, use the closest available Claude coding/reasoning model and preserve the intent: careful repo inspection, high reasoning effort, and source-of-truth discipline.

---

### 2. TASK TITLE

Use a specific task title.

Bad:
“Fix website”

Good:
“Patch Resource Hub directory to add privacy-preserving search/no-results analytics”

---

### 3. CURRENT SOURCE OF TRUTH

Always specify:

* Repository
* GitHub `main` as live/current public code source of truth
* Active branch/PR as proposed truth only
* Current handoff as operational truth
* MASTER operations/source documents as stable workflow/strategy truth
* Old ZIPs, screenshots, prior exports, and old chat assumptions as evidence only

Always instruct Claude to inspect the live repo files before editing.

---

### 4. REPOSITORY / BASELINE

Always include:

* Repository name
* Base branch
* Current known merge commit or baseline SHA if known
* Whether PRs are already merged/open/closed/stale
* Instruction to record current branch and latest `main` SHA in the report

---

### 5. BRANCH

For implementation tasks, specify:

* exact branch name, or branch naming convention;
* branch must be created from latest `main`;
* stop if working tree is not clean;
* stop if already on an unsafe branch;
* stop before touching unrelated files.

For inspection-only tasks, state:

* no new branch required unless Claude Code needs one for local inspection;
* no edits;
* no commits;
* no pushes;
* no PRs.

---

### 6. PATCH TYPE

Classify the task clearly:

* Inspection only
* Content patch
* Analytics micro-patch
* Data maintenance patch
* UX patch
* CSS/layout patch
* JavaScript behavior patch
* QA-only sprint
* Documentation-only patch

Do not mix patch types unless Jason explicitly approves.

---

### 7. OBJECTIVE

State exactly what must be accomplished.

The objective should be narrow, testable, and bounded.

---

### 8. FILES / PAGES TO INSPECT

List likely files.

Also include:

“Inspect the actual source structure first. Do not assume the page is static HTML until confirmed.”

---

### 9. FILES / ACTIONS ALLOWED

List exact files or file categories that may be changed.

For implementation prompts, allowed files must be explicit.

---

### 10. FILES / ACTIONS FORBIDDEN

List exact files, pages, systems, or behaviors that must not be changed.

For website tasks, usually forbid:

* unrelated pages;
* sitewide navigation;
* analytics unless the task is analytics-specific;
* CSS/JS unless required;
* registration forms;
* Resource Hub data unless data patch;
* official/independent disclaimers unless approved;
* new dependencies;
* broad refactors.

---

### 11. PROTECTED BEHAVIORS / BOUNDARIES

Always protect relevant behavior:

* search/filter behavior;
* saved resources;
* localStorage saved-list behavior;
* PT Translate;
* routes, anchors, and URL parameters;
* resource IDs and data attributes;
* registration/event links;
* analytics behavior;
* mobile/tablet/desktop layout;
* official/independent boundary language;
* no claims of Embassy, American Spaces, UniCV, or government endorsement unless already approved.

---

### 12. CONTENT / IMPLEMENTATION REQUIREMENTS

For content tasks:

* include exact message points;
* include bilingual requirements if relevant;
* preserve approved event details;
* preserve links and contact details.

For code tasks:

* specify exact event names, props, privacy rules, helper functions, and trigger logic where relevant;
* require smallest safe change;
* forbid broad refactors.

---

### 13. IMPLEMENTATION RULE

Always include:

“Make the smallest possible change that satisfies the approved objective. This is not a redesign or broad refactor.”

For analytics:
“Do not send raw user-entered search terms or personally identifying information.”

---

### 14. QA EXPECTATIONS

Always require task-appropriate QA.

Common requirements:

* `git status`
* `git diff --check`
* inspect changed file(s)
* confirm no unrelated files changed
* confirm protected behaviors still work
* mobile-width review if public-facing
* desktop review if public-facing
* analytics event verification if analytics-related
* link verification if links changed
* bilingual review if bilingual content changed

---

### 15. APPROVAL GATE

Always state what Claude must stop before doing.

Examples:

* Stop before commit.
* Stop before push.
* Stop before opening PR.
* Stop before editing files.
* Stop before touching files outside the allowed list.

Jason must approve the next step.

---

### 16. STOP CONDITION

Always include explicit stop conditions.

Claude must stop and report before proceeding if:

* source file cannot be identified;
* working tree is not clean;
* current branch is unsafe;
* required edit touches forbidden files;
* task requires unrelated layout/routing/analytics/data changes;
* official/independent boundary becomes uncertain;
* institutional approval appears required;
* the task cannot be completed within the allowed scope.

---

### 17. REQUIRED COMPLETION REPORT

Every Claude Code task must end with an evidence-based completion report.

Required fields:

1. Current branch name
2. Baseline/source of truth confirmed, including latest `main` SHA if available
3. Files inspected
4. Files changed
5. Exact sections/functions changed
6. Summary of changes
7. Links preserved or added
8. Protected files/behaviors not changed
9. Skipped items or checks, with reasons
10. `git diff --check` result, if edits were made
11. QA performed
12. Residual risks or approval-sensitive wording
13. Whether the patch is ready for Jason review
14. Commit hash, if committed
15. PR link, if opened
16. Next approval gate

Do not say “complete,” “done,” or “fixed” unless the approved scope was fully processed or all skipped items are named with reasons.

---

## Hard Rule

If a Claude Code prompt does not include CLAUDE TASK SETTINGS and the sections above, it is incomplete and should not be used.
