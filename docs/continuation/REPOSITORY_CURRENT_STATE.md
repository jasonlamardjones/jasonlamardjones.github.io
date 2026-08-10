# Repository Current State

**Audit date:** 2026-07-20 (all facts below verified directly against the working tree unless labeled otherwise)
**Repository:** `jasonlamardjones/jasonlamardjones.github.io`
**Live site:** https://jasonlamard.com (GitHub Pages, published from `main`, custom domain via `CNAME`)
**Note:** This file is public. It contains technical findings only — no strategy, stakeholder, or private material (see `docs/decisions/website-decision-log.md` scope rule).

---

## 1. Branch and commit state

| Item | Value |
| --- | --- |
| Default branch | `main` |
| `main` HEAD at audit time | `4b8ebb4` — "Merge pull request #39 from jasonlamardjones/feature/prasa-prototype-phase1" |
| Audit/continuation branch | `claude/fable5-audit-continuation-f388ee` (created from `main` @ `4b8ebb4`; open as PR #41) |
| Other remote branches | none (feature branches are deleted after merge) |
| History | 97 commits, 36 merge commits; active 2026-05 (42 commits), 2026-06 (53), 2026-07 (2) |
| `main` protection | Light GitHub ruleset: deletions restricted, force-push blocked, no PR requirement (decision `2026-05-31-002`) |

**Reported prior work — all three confirmed in git history:**

- **PR #36** — "Clarify Workshop 3 MOOC pathways" (merged `93c660d`, commit `06a80d9`). MOOC clarity on `america250-mindelo.html`.
- **PR #38** — "Add privacy-preserving resource search analytics" (merged `d3f2283`, commit `b46e7e0`).
- **PR #39** — "Add tokenized A Prasa prototype shell" (merged `4b8ebb4`, commit `11b1a64`). `/prasa/start.html` and `/prasa/data/finder-tree.json` **both exist** as reported.

## 2. Top-level inventory

```
/                          (repo root = site root; no build step, no package.json, no tests)
├── index.html             Professional site home (546 lines)
├── experience.html        Professional site (392)
├── portfolio.html         Professional site (224)
├── community.html         Professional site (193)
├── contact.html           Professional site (147)
├── america250-mindelo.html  Event/program page (543) — has Plausible
├── style.css              Professional-site stylesheet ONLY (2,562 lines)
├── main.js                Professional-site JS ONLY (179 lines: mobile nav, reveal, translate modal, lightbox)
├── resources.html         Resource Hub "Start here" (672 lines, self-contained)
├── resources-directory.html Resource Hub app: Guide/Find/Directory/Saved (992 lines, self-contained)
├── resources-about.html   Resource Hub About/trust page (838 lines, self-contained)
├── resources-guide.html   Compatibility page — "guide has moved" (88 lines; intentional, NOT stale)
├── resources-data.json    Resource database (7,751 lines, 201 resources) — fetched by hub pages
├── internal-analytics-optout.html  Plausible self-exclusion helper page
├── prasa/                 A Prasa prototype (Phase 1, unlinked, noindex)
│   ├── index.html, start.html, board.html, about.html
│   ├── prasa-config.js    SINGLE SOURCE of all brand/user-facing strings (EN + placeholder PT)
│   ├── prasa.js           Token renderer + board + tap-only finder (297 lines)
│   ├── prasa.css          (418 lines)
│   └── data/finder-tree.json, data/board.json (board data is FICTIONAL sample data)
├── scripts/audit-resources.mjs  Report-only data maintenance audit (540 lines, Node 18+, zero deps)
├── .github/workflows/resource-audit.yml  Weekly audit CI (Mon 07:00 UTC + manual dispatch)
├── docs/decisions/website-decision-log.md  4 decisions logged (newest 2026-05-31-004)
├── docs/resource-audit.md Audit tool documentation
├── docs/continuation/     THIS continuation package (written 2026-07-20)
├── AGENTS.md              Governance rules for AI/code changes (7 rules + required pre/post-edit process)
├── README.md, CNAME (jasonlamard.com), .gitignore
├── Jason-Jones-CV-Community-Developer.pdf
└── ~25 image assets (~16 MB of the repo; several multi-MB, see §7)
```

**Absent (verified):** `404.html`, `favicon.ico`/any favicon, `sitemap.xml`, `robots.txt`, `package.json`, any test files, any build config.

## 3. The three sub-sites and their entry points

The repo hosts **three architecturally separate systems** that share only the GitHub Pages origin:

1. **Professional site** — entry `index.html`; pages share `style.css` + `main.js`; hamburger mobile nav (`.nav-toggle`/`.nav-links`).
2. **Learning & Career Resource Hub** — entry `resources.html` ("Start here"); `resources-directory.html` is the working application (30-second guide modal, finder/filters, provider directory, saved list); `resources-about.html` trust/about; `resources-guide.html` legacy-link compatibility. Each page is fully self-contained (inline CSS + inline JS; no shared hub JS/CSS file). Cross-linked with the professional site in both directions.
3. **A Prasa prototype** — entry `prasa/index.html`. `noindex` on every page, linked from NOWHERE on the main site (verified by grep), English-only rendering, no analytics, no persistence, fictional board data. It is a private-by-obscurity design shell awaiting business decisions.

## 4. Resource Hub data layer (verified)

- `resources-data.json`: `schemaVersion: "resource-hub-data-v1"`, `generatedFrom: "resources.html embedded data"` (historical note — data now lives only in this JSON), `lastExported: 2026-05-20`.
- **201 resources**; 32 fields present on all (id, provider, program, family, category, subcategory, languages, region, audience, cost, format, availability, status, publishStatus, priority, bestFor, description, startStep, url, confidence, lastChecked, island, location, publicStatus, needsVerification, verificationNote, publicDateText, promotionReadiness, maintenanceTier, nextReviewDate, officiality, linkConfidence, publicVisibility); optional fields: `dateWindow` (184), `scheduleSourceType` (125), `keywords` (30), MOOC-cycle date fields (8), platform/content/sponsor provider triple (10).
- `options` block: 76 categories, 91 providers, 43 languages, 53 regions, 10 roles, 4 promotionReadiness values.
- Visibility: 200 `Public` + 1 `Hidden` (CV-015 — intentional; directory correctly shows "200 resources · 91 provider groups").
- Consumers: `resources-directory.html` (`DATA_URL = resources-data.json?v=${DATA_VERSION}`, `DATA_VERSION='20260523-pilot-polish1'`, 10 s fetch timeout, static fallback links on failure) and `resources.html` (independent hard-coded fetch of `resources-data.json?v=20260523-pilot-polish1`, renders top-6 featured "current opportunity" cards). **The cache-busting version string is duplicated in 2 files and the footer "Last database update: 2026-05-20" is a third manual copy.**
- Saved items: `localStorage["jljResourceHubSavedV1"]`; source attribution: `sessionStorage["rh_source"]`.

## 5. Analytics (verified)

- Plausible script `https://plausible.io/js/pa-18CkiXkgdyMGVYCAeXkp7.js` on: `index.html`, `resources.html`, `resources-directory.html`, `resources-about.html`, `resources-guide.html`, `america250-mindelo.html`. **Not** on community/contact/experience/portfolio (unknown whether intentional — see OPEN_DECISIONS).
- QA exclusion: `?qa=1`, `?internal=1`, or `?noanalytics=1` sets `localStorage.plausible_ignore` (script duplicated per page) + `internal-analytics-optout.html`.
- Custom events (via `trackHubEvent`, props sanitized by `safeAnalyticsProps` — RH-AN1, PR #38): `Resource Search Performed`, `Resource Search No Results`, `Official Link Clicked`, `Save Resource Clicked`, `Saved List Exported`, `Saved List Cleared`, `Start Guide Opened`, `Start Guide Applied`, `Translate Clicked`, `Start Page Link Clicked`, `Contact Action Clicked`, `Report Template Copied`.
- Prasa prototype: deliberately **no analytics**.

## 6. Data-health snapshot (from `node scripts/audit-resources.mjs --today 2026-07-20`)

| Category | Count |
| --- | --- |
| Critical (malformed ids/urls/dates) | **0** |
| Expired / likely stale | **7 findings** |
| Needs review | 542 findings |
| Watchlist | 220 findings |
| Distinct resources flagged | 197 of 201 |

**Live correctness issue:** UNI-023, UNI-024, UNI-025 (OPEN MOOCs: English for Tourism / Business & Entrepreneurship / Career Development) still display **"Open Now"** but their `enrollmentCloseDate` was 2026-06-22 and `courseEndDate` 2026-06-29 — both in the past. CV-097 (UniCV Confucius archive) window text cites 2025-09-18. The bulk "needs review" volume is because `lastChecked` values cluster at 2026-05-07…20 and `nextReviewDate` ~2026-06-09 — i.e. **the whole database is ~2 months past its own review budget.** The audit tool is working as designed (report-only); the pending work is human curation.

## 7. Verified broken/stale/dead elements

| Item | Evidence | Class |
| --- | --- | --- |
| 3 MOOC listings shown "Open Now" after course end | audit report, §6 | **Live data error (user-facing)** |
| Whole data file past review dates | 542 needs-review findings | Stale data |
| `headshot.png` (2.0 MB) and `hero-banner.png` (1.7 MB) | referenced by **no** HTML/CSS file (grep) | Dead files, repo bloat |
| ~4.1 MB pathway PNGs downloaded while hidden in collapsed `<details>` | fixed this session (lazy-loading) | Was: performance defect |
| No `404.html` | GH Pages serves default 404 | Gap (minor) |
| No favicon | browsers request `/favicon.ico` → 404 console noise | Gap (cosmetic) |
| Decision log entry 2026-05-31-004 says "Status: Active — On branch v2-visual-foundation-1" | branch no longer exists; the fonts ARE live in the three hub pages | Stale doc status (work merged, log not updated) |
| `generatedFrom: "resources.html embedded data"` | resources.html no longer embeds data | Stale metadata note |

## 8. What was changed in this session (branch `claude/fable5-audit-continuation-f388ee`)

1. `resources-directory.html` — added `loading="lazy" decoding="async"` to the two sample-pathway `<img>`s (2.2 MB + 1.9 MB PNGs inside a collapsed `<details>`). Verified by headless-Chromium mobile smoke test: PNGs are no longer fetched on page load and DO load when the user opens "View sample pathway".
2. `resources.html` — `bike-hub-concept.png` (1.45 MB, below-the-fold section 2) switched `loading="eager"` → `loading="lazy"`.
3. `hub-hero-labeled.jpg` recompressed in place 470 KB → **219 KB** and `opportunity-pathways-landscape.jpg` 695 KB → **324 KB** (same 1536×864 dimensions, progressive JPEG q82; mean pixel delta 2.3/255 and 3.5/255 — visually identical). These are the LCP hero images of the two main hub pages.
4. Added this `docs/continuation/` package (6 files).

**Net effect:** initial mobile payload of `resources-directory.html` dropped ~4.9 MB → ~0.6 MB; `resources.html` hero cost halved. No layout, content, navigation, or design changes. Governance (AGENTS.md) respected: minimal patch, no redesign, trust language untouched.

## 9. Fact vs. inference vs. missing

- **Verified facts:** everything above except where labeled.
- **Inferred intent (not found in repo):** the "V3 priorities" (Home redesign, Curated Pathways, Organizations, JSON split, later Events/PWA/Saved/zero-result suggestions) exist only as reported context from the project owner — no V3 document exists in the repo. Treat as direction, not spec.
- **Missing requirements:** see `OPEN_DECISIONS_AND_QUESTIONS.md`.
