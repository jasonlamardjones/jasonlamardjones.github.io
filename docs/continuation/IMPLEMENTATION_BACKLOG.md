# Implementation Backlog

**As of 2026-07-20.** Ordered within each tier. "Solo-executable" = another capable coding model can do it without further product/design decisions, subject to the AGENTS.md pre/post-edit process and the checks in `TEST_AND_DEPLOYMENT_CHECKLIST.md`. Complexity: S < 2 h, M half-day, L multi-day.

The Resource Hub's core promise governs prioritization: **help a user identify one useful next step in under 60 seconds on mobile.**

---

## CRITICAL NOW

### C1. Correct the expired "Open Now" MOOC listings (live data error)
- **Files:** `resources-data.json` (UNI-023, UNI-024, UNI-025, CV-097); bump `DATA_VERSION` in `resources-directory.html` (~line 465) **and** the `?v=` string in `resources.html` (~line 503); update footer "Last database update" text in `resources-directory.html`.
- **Reason:** Three OPEN MOOC listings display "Available now" but enrollment closed 2026-06-22 and courses ended 2026-06-29. Users acting on them hit dead ends — direct damage to the hub's trust promise.
- **Dependencies:** Human check of https://www.openenglishprograms.org/MOOC for the next cycle. **Without** that check, the safe mechanical fix is: `status`/`publicStatus`/`availability` → `Watch Next Cycle`, `publicDateText` → "Check the official page for the next cycle dates", `needsVerification: true`.
- **Acceptance:** directory + start page no longer show "Available now" for these; `node scripts/audit-resources.mjs` Expired count drops to ≤1 (CV-097 is an archive listing — retitle its window text or accept the flag); cards render correctly.
- **Risks:** low; data-only. Guard: never edit other fields in the same commit (governance: small reviewable data patches).
- **Complexity:** S. **Solo-executable:** yes for the mechanical fallback; the "real next cycle dates" variant needs a human to confirm facts.

### C2. Stale-data curation sweep (the 542 needs-review findings)
- **Files:** `resources-data.json` only (+ version bumps as in C1).
- **Reason:** Every `nextReviewDate` in the file is overdue (~2026-06-09); `lastChecked` clusters at 2026-05-07…20. The hub's credibility rests on freshness claims it currently can't honor.
- **Dependencies:** Human review time (the audit is deliberately report-only — do NOT automate applying changes; that's a standing governance decision, `docs/resource-audit.md`).
- **Acceptance:** flagged count materially reduced; a new `lastExported` date; audit re-run clean of top-priority findings.
- **Risks:** editing 201 records by hand invites JSON syntax errors — validate with the audit script (it hard-fails on parse errors) before committing.
- **Complexity:** M (human-time-bound). **Solo-executable:** no (curation judgment). A model can safely do the batch-mechanical part: updating `nextReviewDate`/`lastChecked` for listings a human has marked verified.

## NEXT

### N1. Finish the image-weight work (started this session)
- **Files:** `learning_pathways_for_language_growth.png`, `educational_learning_paths_for_growth.png`, `bike-hub-concept.png` (convert to JPEG ~q85 or WebP + update the 3 `src` attributes in `resources-directory.html` / `resources.html`); `portfolio-header.png` (2.8 MB), `heroes-stand-down.jpg` (846 KB), `american-spaces.jpg` (579 KB) recompress in place; **delete** unreferenced `headshot.png` (2.0 MB) and `hero-banner.png` (1.7 MB) after re-confirming zero references.
- **Reason:** Remaining multi-MB assets; the three hub PNGs are now lazy-loaded (this session) but still cost 5.5 MB when actually viewed.
- **Dependencies:** owner visual OK on converted illustrations; deletion of files should be explicitly approved.
- **Acceptance:** no page ships an image > ~350 KB; converted images visually indistinguishable; all pages render (smoke test).
- **Risks:** visible compression artifacts (mitigate: q85 + human spot check); broken `src` if a rename is missed (grep every filename before/after).
- **Complexity:** S–M. **Solo-executable:** yes except the two deletions and final visual sign-off.

### N2. De-duplicate the hub's inline runtime into `hub-shared.js`
- **Files:** new `hub-shared.js`; edits in `resources.html`, `resources-directory.html`, `resources-about.html`, `resources-guide.html` replacing the duplicated blocks: analytics QA exclusion, Plausible bootstrap + `trackHubEvent`/`safeAnalyticsProps`, translate-reliability (`jlj-rh-vnext5j`), `getOriginalPageUrl`/`googleTranslateUrl`, `STATIC_FALLBACK_HTML` template.
- **Reason:** Every cross-cutting fix currently must be hand-copied into 3–5 files; drift is already visible (three variants of translate logic). This is the #1 maintainability lever and a precondition for cheap future work.
- **Dependencies:** none (pure refactor), but do AFTER C1/C2 so data fixes aren't entangled.
- **Acceptance:** behavior byte-identical (all analytics events still fire — check Plausible network calls locally; translate modal works on all 4 pages; QA exclusion still works); each helper exists exactly once; total hub HTML shrinks.
- **Risks:** medium — script-order dependencies (QA exclusion MUST run before the Plausible `<script async>`; keep it inline-first or load hub-shared.js synchronously before Plausible). Test all four pages, not just the directory.
- **Complexity:** M. **Solo-executable:** yes, with the smoke test run before/after.

### N3. Move `sanitizeResourceData()` patches into the data file
- **Files:** `resources-data.json` (camara.cv entries), `resources-directory.html` (delete/neuter the function).
- **Reason:** Data corrections currently live as runtime JS string-patching — invisible to the audit script and to curators editing the JSON.
- **Acceptance:** rendered output identical for the affected entries; function body reduced to a no-op or removed; audit script sees the corrected values.
- **Risks:** low. **Complexity:** S. **Solo-executable:** yes.

### N4. Single-source the data version (pre-step for the V3 data split)
- **Files:** `resources-data.json` (add `"dataVersion"` top-level), `resources-directory.html`, `resources.html`.
- **Reason:** Version string currently duplicated in 2 fetch URLs + a footer sentence; a missed bump serves stale cached data for up to browser-cache lifetime.
- **Approach that keeps cache-busting:** keep ONE constant per page but generate footer text from the loaded JSON's `dataVersion`/`lastExported`; document the two-place bump in a comment at each site. (Full single-sourcing needs a build step or a version manifest fetch — defer.)
- **Acceptance:** footer date renders from data; comments point maintainers to both bump sites.
- **Risks:** low. **Complexity:** S. **Solo-executable:** yes.

### N5. Add `404.html` + favicon
- **Files:** new `404.html` (plain, hub-styled links to `/` and `/resources.html`), favicon files + `<link rel="icon">` per page head (or accept root `favicon.ico` only, zero markup edits).
- **Reason:** GH Pages default 404 dead-ends lost users (there are legacy URLs in circulation — `resources-guide.html` exists precisely because of this); favicon 404 console noise.
- **Acceptance:** unknown URL shows branded 404 with working links; no favicon 404 in console.
- **Risks:** minimal. Keep 404 visually neutral to avoid redesign scope. **Complexity:** S. **Solo-executable:** yes.

## LATER (needs product input before code)

### L1. V3 data split (`data/resources.json`, `organizations.json`, `events.json`, `meta.json`)
Reported V3 priority 4. Needs schema sign-off (proposed field mapping in OPEN_DECISIONS Q3). Keep `resources-data.json` as a generated compatibility artifact during migration. Complexity L. Not solo-executable (schema decisions).

### L2. Curated Pathways (V3 priority 2)
The directory's pathway cards + `data-pathway-search` presets are the seed. A real "pathway" (ordered steps, prerequisites, outcomes) needs curation content that doesn't exist in-repo. Complexity M–L once content exists. Not solo-executable.

### L3. Organizations view (V3 priority 3)
91 providers already enumerated in `options.providers`; an organizations page needs per-org descriptions/contacts — new data. Not solo-executable.

### L4. Zero-result suggestions in the finder
`Resource Search No Results` analytics (PR #38) was built to collect exactly the evidence for this. Implementation: on 0 results, offer the existing quick-path buttons (`EMPTY_PATHWAYS_HTML` already exists and renders for empty states — extend with query-aware suggestions). Complexity S–M. Solo-executable once suggestion rules are defined (or ship the existing static quick-paths for all zero-result cases — that IS safe now if desired).

### L5. Home redesign (V3 priority 1) — blocked by governance
AGENTS.md forbids redesign without an explicit request with direction. Requires owner-provided design intent. Park.

### L6. Events, PWA/offline, saved-list improvements
Explicitly "later" in the reported V3 list. Events needs a source-of-truth decision (Q5). PWA needs offline strategy for a fetch-dependent app. Park.

### L7. Prasa Phase 2 (language toggle, real board data, station pages)
Blocked on: native-speaker PT review (all PT strings are machine-drafted placeholders — stated in every file), brand decision (Rename Day), and the business decision to link/publish. The config/token architecture is ready for it. Park.

## DO NOT DO YET

- **Framework/SSG migration** — not justified by scale; high risk to protected layouts; the actual pain (duplication, data hygiene) is fixable in place (see architecture map §5).
- **Auto-applying audit findings to the data** — standing governance: the audit is report-only; curation is human.
- **Publishing/linking `/prasa/`, brand rename, PT publication** — business/brand decisions pending; PT text explicitly not-for-publication.
- **Hub CSS consolidation / color-token harmonization** — explicitly deferred by decision 2026-05-31-004; do after N2, as its own reviewed branch.
- **Changing hub navigation semantics** (hamburger, reordering) — protected by AGENTS.md rule 4; needs explicit owner request.
- **Editing trust/disclaimer language anywhere** — AGENTS.md rule 7; high sensitivity.
