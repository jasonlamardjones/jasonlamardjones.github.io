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

## 2026-05-31-004 · V2 Typography Foundation — Hub-only font loading and token wiring

**Status:** Active — On branch v2-visual-foundation-1
**Date:** 2026-05-31
**Applies to:** Resource Hub (resources.html, resources-directory.html, resources-about.html)

### Decision
Load Fraunces (display serif) and Manrope (humanist sans-serif) via Google Fonts `<link>` tags in the `<head>` of the three Hub HTML files only. Declare `--v2-heading` and `--v2-body` CSS custom properties in each file's inline `:root` block, additive alongside existing tokens. Wire those tokens to the active body and heading `font-family` declarations in each file, including the VNEXT4 `!important` overrides in resources-directory.html and resources-about.html.

### Why
Establishes a visible, controlled typography foundation for the V2 Hub design direction without touching style.css, professional site pages, JS, data, layout, color, or breakpoints. Fraunces brings editorial weight to headings; Manrope provides a cleaner, more legible sans-serif for body and UI text. The `--v2-` prefix keeps these tokens clearly scoped and non-destructive — no existing tokens are renamed or removed.

### What was rejected
- Loading Fraunces/Manrope through style.css (would affect professional site pages)
- Declaring tokens without wiring them to active rules (would load fonts invisibly)
- Changing colors, layout, spacing, or breakpoints in this branch
- Color/token harmonization across the three Hub files is explicitly deferred to a later branch (the `--navy` divergence between `#0e2b52` in resources.html and `#0C111D` in the directory/about pages is a known pre-existing inconsistency)

### Source of truth
Branch: v2-visual-foundation-1

### Linked decisions
- Builds on: 2026-05-31-003, 2026-05-31-001

### Next review trigger
After visual QA of Fraunces/Manrope rendering across the three Hub pages. Color/token harmonization to follow in a separate branch.

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
