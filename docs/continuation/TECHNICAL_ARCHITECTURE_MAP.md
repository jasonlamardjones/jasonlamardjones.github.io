# Technical Architecture Map

**As of 2026-07-20.** Companion to `REPOSITORY_CURRENT_STATE.md`. Public file — technical content only.

---

## 1. The three systems

```
jasonlamard.com  (GitHub Pages, static, published from main, no build step)
│
├── PROFESSIONAL SITE ─────────── shared style.css + main.js
│     index.html ─┬─ experience.html
│                 ├─ portfolio.html
│                 ├─ community.html
│                 ├─ contact.html
│                 └─ america250-mindelo.html   (event page; Plausible; self-managed sections)
│
├── RESOURCE HUB ──────────────── every page self-contained (inline CSS+JS); NO shared hub file
│     resources.html            "Start here" — orientation + top-6 featured cards (fetches JSON)
│     resources-directory.html  The app: 30-sec guide modal, finder/filters/search,
│     │                         provider directory tabs, saved list (localStorage)
│     │                         └── fetch resources-data.json?v=DATA_VERSION (10 s timeout → static fallback)
│     resources-about.html      Trust/about/curation policy
│     resources-guide.html      Compatibility stub for old links ("guide has moved")
│     internal-analytics-optout.html
│
└── A PRASA PROTOTYPE (/prasa/) ─ own prasa.css + prasa.js + prasa-config.js; noindex; UNLINKED
      index.html  (stations grid + board preview)
      start.html  (tap-only finder ← data/finder-tree.json)
      board.html  (opportunity board ← data/board.json — fictional sample items)
      about.html  (boundary/disclaimer text from config)
```

**Cross-links:** professional site ↔ Resource Hub link to each other (nav + footers). Nothing links to `/prasa/`. The hub never reads professional-site assets and vice versa. The three CSS worlds are fully independent (`style.css` is loaded by professional pages only — verified).

## 2. Page-internal architecture of the hub (the part that matters most)

Each hub page is a **single-file application**: one `<style>` block (413–711 lines), then stacked `<script>` blocks appended chronologically as patches. Script blocks carry patch IDs in their `id` attributes — this is the de-facto changelog of the page:

- `jlj-analytics-qa-exclusion` (all pages) — QA opt-out before Plausible loads
- `rh-vnext5h-direct-routing-fix` (directory) — `?view=guide|find|directory|saved` + hash routing, sticky-offset scroll
- `jlj-fqa1-directory-behavior-fix` (directory) — "Use filters" affordance opens the advanced `<details>` and focuses search
- `jlj-rh-vnext5j-translate-reliability` (resources, directory, about) — translate-modal wiring, duplicated per page
- `index-hero-translation-hotfix`, `RH-JLJ-TRANSLATE-VISIBILITY1`, `RH-JLJ-SOFTLAUNCH-SAFETY1` — layout/visibility hotfixes

The directory app core (inline, ~300 lines): `RESOURCES`/`OPTS` globals ← fetch → `sanitizeResourceData()` (runtime data patching — tech debt) → filter pipeline (search text incl. PT/FR/NL/UK/RU keyword aliases, region, category, availability, language, role, cost, provider, audience, certificate) → grouped render into `#currentGroups`, `#resultsGroups` (by provider), `#directoryGroups` (by location tab) → saved-list module (`jljResourceHubSavedV1`) → analytics events.

**Navigation contract (protected by AGENTS.md rule 4):** hub topbar nav = `Start here / Current opportunities / 30-second guide / Find / Directory / About / Saved / PT Translate`, where Guide/Find/Directory/Saved are all **views of resources-directory.html** driven by `?view=` + hash. Mobile: nav is horizontally scrollable (labels intentionally truncate as a scroll affordance); a fixed bottom float-nav (`Top / Find / Directory / Saved`) provides thumb-reach navigation. There is no hamburger on hub pages — this is a deliberate pattern, do not "fix" it without an explicit request.

## 3. Data flow

```
[human curation]
   └─ resources-data.json  (single source of truth; schemaVersion resource-hub-data-v1)
        ├─ resources-directory.html  fetch ?v=DATA_VERSION  → full app
        ├─ resources.html            fetch ?v=<same string, hard-coded separately> → top-6 featured
        ├─ scripts/audit-resources.mjs (local / weekly CI) → resource-audit-report.md (git-ignored, report-only)
        └─ (footer text "Last database update: YYYY-MM-DD" — manual 3rd copy of the version fact)

[prasa]  data/finder-tree.json → prasa.js finder     (structure mirrors nothing else; tap-only tree)
         data/board.json      → prasa.js board       (sample data; empty items[] → empty state; ?demo=empty QA hook)
         prasa-config.js      → ALL strings incl. brand (Rename-Day rule: brand change = edit this file only)
```

**Update protocol for resource data (implicit, now explicit):** edit `resources-data.json` → bump `DATA_VERSION` in `resources-directory.html` **and** the `?v=` string in `resources.html` → update the footer "Last database update" line → run the audit script → commit. Any future refactor should collapse these three manual copies into one.

## 4. Where A Prasa and the Resource Hub touch (and where they must not)

**Current coupling: none at code level.** Separate CSS/JS/data/pages; no shared assets; no links.

**Conceptual coupling (by design):** Prasa's stations (Learn / Works / Board / Business / Guide) are a brandable re-partition of the hub's domains; `finder-tree.json` leaves point at stations the hub already serves with real data; Prasa's `board.json` is the shape of a future "events/opportunities" feed that the hub's `resources-data.json` already approximates with `status`/`dateWindow` fields.

**Recommended boundary (keep until an explicit business decision):**
- Prasa owns *presentation + brand experiment*; it must keep rendering only from `prasa-config.js` + its own `data/`. No hub imports.
- The hub owns *real data and curation*; it must never depend on Prasa files.
- If/when Prasa goes live with real data, the correct integration is a **shared data layer** (e.g. Prasa board reads a generated/filtered export of `resources-data.json`), never shared HTML/CSS/JS. That keeps Rename-Day and the independent/non-official boundary intact on both sides.

## 5. Safest incremental architecture (recommendation)

The current architecture — static multi-page, no build, one JSON database, self-contained pages — is **appropriate for this site's scale and solo-maintainer workflow**. A framework/SSG migration is NOT required and is explicitly not recommended now: it would violate the minimal-patch governance, risk the protected hub layouts, and buy little (the pain points are duplication and data hygiene, both fixable in place). Evolve in this order:

1. **Data first (lowest risk, highest leverage):** keep `resources-data.json` authoritative; fix stale listings; move `sanitizeResourceData()` patches into the data itself; then (as the V3 "separated data structures" step, with owner sign-off) split into `data/resources.json` + `data/organizations.json` + `data/events.json` + `data/meta.json` (holding `dataVersion` so pages read ONE version string), keeping a compatibility `resources-data.json` until both pages are migrated.
2. **Shared hub runtime second:** extract the byte-identical duplicated inline scripts (analytics QA exclusion, translate reliability, fallback template, `getOriginalPageUrl`) into one `hub-shared.js` loaded by the four hub pages. No behavior change; verify with the smoke test in `TEST_AND_DEPLOYMENT_CHECKLIST.md`. Only after that consider a shared `hub.css` for genuinely identical rules (the `--navy` divergence `#0e2b52` vs `#0C111D` is a *known, deliberate-for-now* inconsistency — decision log 2026-05-31-004).
3. **Pages last:** new features (Pathways, Organizations) should be new pages/sections following the same self-contained pattern until (2) exists, then adopt `hub-shared.js`.
4. **Prasa stays frozen** as a shell until brand/business decisions land (see OPEN_DECISIONS). Its token/config architecture is sound; Phase 2 items (PT toggle, real board) plug into the existing structure without rework.

## 6. Deployment pipeline

`git push` to `main` → GitHub Pages builds/publishes automatically (no Actions build workflow needed; the only workflow is the read-only weekly data audit) → served at `jasonlamard.com` (CNAME). Rollback = revert the offending commit on `main` (force-push is blocked by ruleset). There is no staging environment; PR branches can be previewed locally with `python3 -m http.server` (fetch() requires http://, not file://).
