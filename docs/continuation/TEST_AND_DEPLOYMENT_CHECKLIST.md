# Test and Deployment Checklist

**As of 2026-07-20.** There is no test framework, no build step, and no staging environment — verification is: (1) the data audit script, (2) a local serve + browser pass, (3) an optional headless smoke script (below). Run what matches your change.

---

## 1. Always, before any commit

```bash
git status                       # only intended files changed
git diff --stat                  # diff size matches the stated patch scope (AGENTS.md: minimal patches)
```

If `resources-data.json` changed:

```bash
node scripts/audit-resources.mjs            # hard-fails on JSON parse errors; review the findings delta
node scripts/audit-resources.mjs --fail-on-critical   # must exit 0
```

Remember the **three-place version bump** when data changes: `DATA_VERSION` in `resources-directory.html`, the `?v=` string in `resources.html` (~line 503), the footer "Last database update" sentence in `resources-directory.html` (until backlog N4 lands).

## 2. Local serve (required for any HTML/JS/data change)

`fetch()` does not work from `file://` — always serve:

```bash
python3 -m http.server 8765     # from repo root, then open http://localhost:8765/
```

**Manual pass, mobile viewport (~390 px, browser devtools), for hub changes:**

- [ ] `resources.html` — hero renders; "Current opportunities" shows 6 cards (not the static fallback); every nav link works
- [ ] `resources-directory.html` — result count shows "200 resources · 91 provider groups"; search `english` filters; a `?view=guide` URL opens the guide modal; `?view=saved` scrolls to saved panel
- [ ] Save a resource → count badges update (nav, float-nav) → Saved panel lists it → Clear works
- [ ] 30-second guide: complete it → results filter → "Start over" resets
- [ ] Translate button opens the help modal on resources / directory / about
- [ ] `resources-about.html` renders; footers show the independence disclaimer (NEVER edited — AGENTS.md rule 7)
- [ ] No new console errors (expected offline noise: Plausible/Google Fonts blocked; missing favicon 404 is a known gap)

**Professional-site changes:** hamburger nav opens/closes on mobile; reveal animations; lightbox; translate modal (`main.js` drives all four).

**Prasa changes:** `/prasa/` all 4 pages render token text (no empty `data-t` elements); finder completes a path (tap-only) and Back/Start-over work; `board.html?demo=empty` shows the empty state; every page shows the boundary note.

## 3. Headless smoke script (optional, ~30 s)

Used and verified in the 2026-07-20 session. Requires `npm i playwright-core` plus a Chromium (in Claude remote sandboxes one is preinstalled at `/opt/pw-browsers/`; locally use `npx playwright install chromium` or point `executablePath` at any Chrome).

```js
// smoke.mjs — run: node smoke.mjs   (serve the repo on :8765 first)
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ /* executablePath: '/path/to/chrome' */ });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const page = await ctx.newPage();
await page.goto('http://localhost:8765/resources.html', { waitUntil: 'load' });
await page.waitForTimeout(2500);
console.log('start cards:', await page.locator('#currentCards article').count());          // expect 6
console.log('fallback shown:', await page.locator('[data-static-fallback]').count());      // expect 0
await page.goto('http://localhost:8765/resources-directory.html', { waitUntil: 'load' });
await page.waitForTimeout(2500);
console.log('result count:', await page.locator('#resultCount').textContent());            // "200 resources · 91 provider groups"
console.log('directory groups:', await page.locator('#directoryGroups > *').count());      // expect 91
await browser.close();
```

Pass criteria: 6 / 0 / "200 resources…" / 91 (update expectations when the database legitimately changes).

## 4. Accessibility spot checks (any UI-touching change)

- [ ] Tab order reaches nav, filters, cards, modals; modal close buttons focusable; Escape closes modals (translate, guide, lightbox)
- [ ] New images have meaningful `alt`; decorative SVGs keep `aria-hidden="true"`
- [ ] Tap targets ≥ ~40 px on mobile; text ≥ 16 px equivalent (AGENTS.md rule 5: no mobile regressions)
- [ ] Status/`aria-live` regions intact: `#finderResult` (prasa), `#copyStatus`, `#saveToast`

## 5. Performance guard (added 2026-07-20)

- [ ] No image ships eager above ~500 KB; below-the-fold images carry `loading="lazy" decoding="async"`
- [ ] New images: compress before commit (JPEG q80–85 progressive; target < 350 KB) — repo has no build step, so bytes committed = bytes served
- [ ] Directory initial mobile payload stays ≈ 0.6 MB (HTML + JSON + hero); do not reintroduce eager multi-MB assets

## 6. Deployment

1. Merge the PR into `main` (or push to `main` for trivial approved changes — solo-maintainer ruleset allows it; prefer PRs).
2. GitHub Pages auto-builds from `main` (root). Typically live in ~1–2 min; CDN may hold cached HTML a few minutes more.
3. Verify live: https://jasonlamard.com/resources.html — check the changed behavior + hard-refresh (⌘⇧R) for CSS/JS; the `?v=` param handles JSON caching.
4. Post-deploy: browse with `?qa=1` once per device to keep your own visits out of Plausible.

## 7. Rollback

- **Standard:** `git revert <commit>` on `main`, push. (Force-push to `main` is blocked by ruleset — revert, don't rewrite.)
- **Single file to a known-good state:** `git checkout 4b8ebb4 -- <file>` then commit (e.g. the pre-session originals of `hub-hero-labeled.jpg` / `opportunity-pathways-landscape.jpg` live at `4b8ebb4`).
- **Data emergency:** `resources-data.json` from any prior commit + bump the version strings so clients drop cached copies.
- GitHub Pages redeploys on every push to `main`; no manual invalidation exists — worst-case wait is minutes.
