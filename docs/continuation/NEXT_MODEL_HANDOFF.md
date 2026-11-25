# Next Model Handoff

**Written 2026-07-20** by the final Fable 5 session on this project. Audience: any capable coding model (ChatGPT, Gemini, Claude, Codex, other) or human continuing this work. **You do not need to re-audit the repository** — read this file plus the four companions in `docs/continuation/` and start working.

> **Read first, in order:** (1) `AGENTS.md` at repo root — binding governance rules incl. a required pre-edit plan and post-edit summary for every change; (2) this file; (3) `REPOSITORY_CURRENT_STATE.md` (verified facts), `TECHNICAL_ARCHITECTURE_MAP.md` (how it fits together), `IMPLEMENTATION_BACKLOG.md` (all queued work with acceptance criteria), `OPEN_DECISIONS_AND_QUESTIONS.md` (what NOT to decide yourself), `TEST_AND_DEPLOYMENT_CHECKLIST.md` (how to verify and ship).

---

## 1. State at handoff

- **Repo:** `jasonlamardjones/jasonlamardjones.github.io` → https://jasonlamard.com (GitHub Pages from `main`, no build step, static HTML/CSS/JS + one JSON database).
- **`main`** = `4b8ebb4` (merge of PR #39, A Prasa prototype). Protected: no force-push, no deletion.
- **Session branch `claude/fable5-audit-continuation-f388ee`** (from `4b8ebb4`), contains:
  - `eb80ef9` — "Reduce Resource Hub mobile page weight" (the session's implementation, details in §2)
  - a docs commit adding `docs/continuation/` (this package)
- **Open as PR #41** (https://github.com/jasonlamardjones/jasonlamardjones.github.io/pull/41). Not merged; merging requires the owner's explicit approval. Further pushes to the session branch update that PR.

**Three systems, one repo** (full map in `TECHNICAL_ARCHITECTURE_MAP.md`): professional site (`index.html` + `style.css` + `main.js`), Resource Hub (`resources*.html`, each page self-contained, data from `resources-data.json` — 201 listings), and the unlinked `noindex` A Prasa prototype under `/prasa/` (token-driven, all strings in `prasa-config.js`, fictional sample data). The hub's product promise that governs prioritization: **one useful next step in under 60 seconds on mobile.**

## 2. Work completed this session (exact files)

1. **Full repository audit** — findings in `REPOSITORY_CURRENT_STATE.md`. Highlights: 3 MOOC listings publicly show "Open Now" after their 2026-06 close dates (live data error); the whole database is ~2 months past its own review dates (542 audit findings); `headshot.png`/`hero-banner.png` (3.7 MB) are referenced nowhere; heavy inline-script duplication across hub pages.
2. **Implementation (commit `eb80ef9`)** — Resource Hub mobile page-weight fix:
   - `resources-directory.html`: two sample-pathway `<img>` tags gained `loading="lazy" decoding="async"` (they sit in a collapsed `<details>`; 4.1 MB of PNGs no longer download on page load — verified they still load when revealed).
   - `resources.html`: `bike-hub-concept.png` `loading="eager"` → `"lazy"` (below-the-fold).
   - `hub-hero-labeled.jpg` 470→219 KB, `opportunity-pathways-landscape.jpg` 695→324 KB (in-place progressive-JPEG q82, dimensions unchanged 1536×864, mean pixel delta ≤3.5/255).
   - Verified with a 390-px headless-Chromium pass: start page renders 6 featured cards from JSON, directory renders "200 resources · 91 provider groups", no new console errors.
3. **This continuation package** (6 files in `docs/continuation/`).

## 3. Unresolved issues you inherit

| # | Issue | Where documented |
| --- | --- | --- |
| 1 | Expired "Open Now" MOOC listings (UNI-023/024/025) + CV-097 stale window text | Backlog **C1** — do this first |
| 2 | Database-wide review overdue (human curation needed) | Backlog C2 |
| 3 | Remaining heavy images + 2 dead multi-MB files | Backlog N1 (deletions need owner OK) |
| 4 | Inline-script duplication across 4 hub pages | Backlog N2 |
| 5 | Runtime data patching in `sanitizeResourceData()` | Backlog N3 |
| 6 | Data version string maintained in 3 places | Backlog N4 |
| 7 | No 404 page / favicon | Backlog N5 |
| 8 | All product-shaped V3 work (home redesign, pathways, organizations, data split, events) awaits owner decisions | Backlog L1–L7, OPEN_DECISIONS Q3/Q6/Q7 |

## 4. Hard rules (do not skip)

- **Follow `AGENTS.md`:** minimal focused patches; NO redesign/layout/IA changes without an explicit request; never touch trust/disclaimer language; preserve hub navigation semantics and mobile usability; provide a pre-edit plan and post-edit summary.
- **Data changes:** always re-run `node scripts/audit-resources.mjs` (parse check + findings), and bump the version in BOTH `resources-directory.html` (`DATA_VERSION`) and `resources.html` (`?v=` in the fetch URL), plus the footer "Last database update" text.
- The audit tooling is **report-only by standing decision** — never auto-apply its findings.
- `/prasa/` stays unlinked, `noindex`, analytics-free, sample-data-only until the owner says otherwise. Its brand name changes only via `prasa-config.js` (one-file Rename-Day rule).
- Portuguese strings marked as machine-drafted placeholders must not be presented as reviewed/final.
- Do not merge to `main` without explicit owner approval.

## 5. Next three recommended tasks — copy-ready prompts

### Task 1 (do first): fix the expired MOOC listings — backlog C1

```text
In jasonlamardjones/jasonlamardjones.github.io, read AGENTS.md and
docs/continuation/ first. On a new branch from main, edit resources-data.json
only, for ids UNI-023, UNI-024, UNI-025: these OPEN MOOC listings still say
"Open Now" but enrollmentCloseDate 2026-06-22 and courseEndDate 2026-06-29
have passed. Unless you can verify announced next-cycle dates on
https://www.openenglishprograms.org/MOOC, apply the safe fallback: set
status, publicStatus and availability to "Watch Next Cycle"; set
publicDateText and dateWindow to "New cycles are announced by OPEN — check
the official page for the next enrollment dates."; set needsVerification
true; update lastChecked to today. Also for CV-097, rewrite dateWindow/
publicDateText so the elapsed 2025-09-18 date reads as an archived past
cycle. Then bump DATA_VERSION in resources-directory.html, the ?v= string in
the resources.html fetch (~line 503), and the footer "Last database update"
sentence in resources-directory.html. Verify: node scripts/audit-resources.mjs
--fail-on-critical exits 0 and the Expired section no longer lists UNI-023/4/5;
serve locally (python3 -m http.server 8765) and confirm these cards show
"Check next dates" on resources-directory.html. Do not edit any other
listings or files. Commit with a clear message; open a PR; do not merge.
```

### Task 2: move runtime data patches into the data — backlog N3

```text
In jasonlamardjones/jasonlamardjones.github.io (read AGENTS.md +
docs/continuation/ first), branch from main. In resources-directory.html
find function sanitizeResourceData() (~line 500): it patches camara.cv
listings at runtime (url normalization, status/verificationNote defaults,
appended bestFor text, appended keywords). Apply those same final values
directly to the matching entries in resources-data.json, then reduce
sanitizeResourceData to a no-op (keep the function defined, empty body, with
a one-line comment that data fixes belong in resources-data.json). Bump the
data version in the three places listed in docs/continuation/
TEST_AND_DEPLOYMENT_CHECKLIST.md §1. Verify with the checklist's local-serve
pass: the Câmara de Comércio de Barlavento cards render identical text
before/after (screenshot-compare), result count still "200 resources · 91
provider groups", audit script passes. PR, do not merge.
```

### Task 3: extract shared hub runtime — backlog N2 (bigger; do after 1–2)

```text
In jasonlamardjones/jasonlamardjones.github.io (read AGENTS.md +
docs/continuation/ first — especially TECHNICAL_ARCHITECTURE_MAP.md §2),
branch from main. Create hub-shared.js at repo root containing exactly one
copy of the logic currently duplicated across resources.html,
resources-directory.html, resources-about.html and resources-guide.html:
(a) the analytics QA exclusion (script id jlj-analytics-qa-exclusion),
(b) the Plausible queue bootstrap + trackHubEvent + safeAnalyticsProps,
(c) getOriginalPageUrl/googleTranslateUrl + the translate-help modal wiring
(script id jlj-rh-vnext5j-translate-reliability and equivalents).
Load it with a synchronous <script src="hub-shared.js"> placed BEFORE the
async Plausible <script> in each page's head so the QA exclusion still runs
first. Remove only the duplicated blocks you replaced; keep page-specific
code inline. Behavior must be byte-identical: verify with docs/continuation/
TEST_AND_DEPLOYMENT_CHECKLIST.md §2 on ALL FOUR pages (translate modal opens/
closes, ?qa=1 sets localStorage.plausible_ignore, saved list works, guide
opens, no console errors) plus the §3 smoke script. Keep the diff reviewable;
no CSS changes, no renames, no other refactors. PR, do not merge.
```

(Easy alternates if blocked: backlog **N5** — add `404.html` + favicon; **N4** — footer date from JSON.)

## 6. Tests to run

For any change: `TEST_AND_DEPLOYMENT_CHECKLIST.md` §1–§2 (git hygiene, audit script for data, local serve + mobile manual pass). Optional headless smoke script in §3 with expected values (6 cards / 0 fallback / "200 resources · 91 provider groups" / 91 groups). Accessibility spot checks §4 for UI changes. Performance guard §5 for any image/asset work.

## 7. Deployment and rollback

Deploy = merge/push to `main`; GitHub Pages publishes automatically (~1–2 min). No staging — preview locally. Rollback = `git revert` on `main` (force-push blocked). Known-good file restore: `git checkout 4b8ebb4 -- <file>` (pre-session state) or `eb80ef9` (post-perf-fix state). Data rollback: restore `resources-data.json` from a prior commit AND bump the version strings. Full detail: `TEST_AND_DEPLOYMENT_CHECKLIST.md` §6–§7.
