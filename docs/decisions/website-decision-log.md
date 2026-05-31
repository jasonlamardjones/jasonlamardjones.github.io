# Website Decision Log

**Scope:** Public technical website decisions only — visual design, code architecture,
patch sequencing, accessibility, and public-safe tool choices.

**What does NOT go here:** Strategy, stakeholder context, American Spaces or
Embassy-adjacent decisions, faith positioning, monetization, vendor concerns,
private AI workflow decisions, or any sensitive material. Those are stored privately,
off this repo.

**Rule:** Treat everything in this file as publicly readable.

---

## Decision History

Newest entries at the top.

---

## 2026-05-31-003 · Repo Hygiene Cleanup

**Status:** Proposed in PR
**Date:** 2026-05-31
**Applies to:** Repo

### Decision
Replace stale README.md with an accurate public-safe repo description. Add .gitignore
for OS, editor, environment, and local file safety. Add this decision log at
docs/decisions/website-decision-log.md.

### Why
README contained setup-era placeholder instructions no longer relevant to the
live site. No .gitignore was present, creating risk of accidental commits of OS or
local files. Decision log was planned but not yet in the repo.

### What was rejected
- Leaving README stale
- Adding .gitignore only as part of V2 work

### Source of truth
Branch: repo-hygiene-cleanup

### Linked decisions
- Builds on: 2026-05-31-002, 2026-05-31-001

### Next review trigger
Before V2 branch work begins.

---

## 2026-05-31-002 · Main Branch Light Protection

**Status:** Approved
**Date:** 2026-05-31
**Applies to:** Repo

### Decision
Enable a light GitHub Ruleset on main: restrict deletions and block force pushes.
No PR requirement, no required status checks, no signed commits, no merge queue,
no branch lock.

### Why
Prevents accidental deletion or force-push of main. Light enough not to block
solo workflow but adds a meaningful safety floor.

### What was rejected
- Stricter ruleset requiring PRs or status checks (would slow solo workflow)
- No protection at all

### Source of truth
Confirmed via GitHub branch ruleset settings, 2026-05-31.

### Linked decisions
- Builds on: standard repo hygiene

### Next review trigger
If a second collaborator is added to the repo.

---

## 2026-05-31-001 · Plain-Language Availability Labels (v1B-1)

**Status:** Approved — Merged
**Date:** 2026-05-31
**Applies to:** Resource Hub

### Decision
Replace institutional availability shorthand with plain-language display labels
site-wide: "Available now," "Available anytime," "Opens soon," "Check next dates,"
and "Check details / Check dates."

### Why
First-time and non-native English speakers found terms like "Next Cycle,"
"Ongoing," and "Check Official Site" unclear. Plain-language labels reduce
cognitive load and support the Hub's accessibility-first direction. Internal
data values in resources-data.json were not changed — display labels only.

### What was rejected
- Keeping original institutional labels unchanged
- Showing both old and new labels simultaneously

### Source of truth
PR #6, merge commit 166ffc93e767b97fe65f040a698c5740ab063cc9.
Files changed: resources-directory.html, resources.html, resources-about.html.
Protected untouched: resources-data.json, main.js, style.css.

### Linked decisions
- Builds on: v1A soft-launch simplification

### Next review trigger
After 30 days of user observation, or when V2 design begins.
