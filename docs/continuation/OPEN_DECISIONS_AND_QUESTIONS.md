# Open Decisions and Questions

**As of 2026-07-20.** Decisions only the project owner can make. Nothing here blocks the CRITICAL/NEXT backlog except where noted. Public file — questions are framed technically; business/strategy context stays off-repo per the decision-log scope rule.

**Ownership lanes (as reported to this session):** A Prasa = business/brand/commercial/organizational decisions · Resource Hub = product requirements, curation, pathways/resources/organizations/events · Website & GitHub Technical Operations = code, architecture, testing, accessibility, deployment.

---

## Data / curation (Resource Hub lane)

**Q1 — OPEN MOOC next cycle (blocks the "ideal" version of backlog C1).**
Do UNI-023/024/025 have announced next-cycle dates, or should they read "Check next dates" until announced? The mechanical fallback (status → `Watch Next Cycle`) is safe to apply without this answer.

**Q2 — Curation cadence.**
`nextReviewDate` across the file is ~5 weeks overdue. Is the intended rhythm the one encoded in `maintenanceTier` ("Biweekly when active; monthly otherwise"), and who executes it? Should the weekly CI audit open a GitHub issue automatically when Critical/Expired > 0 (still report-only, but visible)?

**Q3 — V3 data split schema (blocks backlog L1).**
Proposed split for sign-off: `data/resources.json` (curated listings, current schema minus org fields), `data/organizations.json` (keyed by provider name → description, url, type, islands), `data/events.json` (dated items: the current 8 MOOC-cycle-date listings + future events), `data/meta.json` (`dataVersion`, `lastExported`). Approve/amend field mapping? Keep root `resources-data.json` as a generated compatibility file during migration?

**Q4 — CV-015 is the only `publicVisibility: "Hidden"` listing.** Intentional long-term, or pending something?

**Q5 — Events source of truth (blocks L6).**
Events currently live three ways: `america250-mindelo.html` (hand-built page), 8 resources with cycle dates in the JSON, and Prasa's fictional `board.json`. Which becomes canonical when Events work starts?

## Product / UX (Resource Hub lane)

**Q6 — Home redesign (V3 priority 1; blocks L5).**
AGENTS.md rule 2 forbids redesign without an explicit request. What is in scope: `index.html` (professional home) or `resources.html` (hub start)? What direction/brief? Until answered, no model should touch layout.

**Q7 — Pathway definitions (blocks L2).**
What are the first 2–3 curated pathways (e.g. "zero English → workplace English", "no digital skills → first certificate")? Steps, target persona, completion signal?

**Q8 — Zero-result behavior (enables L4 now).**
When a search returns nothing, is showing the existing 8 quick-path buttons (already built as `EMPTY_PATHWAYS_HTML`) the desired v1? If yes, L4 becomes solo-executable immediately.

**Q9 — Mobile hub nav.**
The horizontally scrolling top nav truncates later items ("30-se…") by design (scroll affordance) with a bottom float-nav as a complement. Keep as protected pattern, or is a revisit wanted at some point? (Protected until explicitly requested.)

## Analytics / privacy (Technical Operations lane)

**Q10 — Plausible coverage.**
community/contact/experience/portfolio have no analytics script; index + hub + america250 do. Intentional split or gap to close?

## Assets (Technical Operations lane, owner sign-off)

**Q11 — Delete dead files?** `headshot.png` (2.0 MB) and `hero-banner.png` (1.7 MB) are referenced nowhere. Delete, or kept for future use? (They remain in git history either way.)

**Q12 — Image conversion QA.** For N1, is owner visual sign-off wanted per converted illustration, or is a numeric threshold (e.g. mean pixel delta < 4/255, as used this session) acceptable?

## A Prasa (business lane — all parked, none block hub work)

**Q13 — Brand name.** "A Prasa" is a working placeholder (stated in `prasa-config.js`). Rename Day = one-file edit by design. When?

**Q14 — Publish/link decision.** When (if) should `/prasa/` be linked from anywhere, lose `noindex`, gain analytics, and show real board data? Currently private-by-obscurity with fictional data — correct posture until decided.

**Q15 — Portuguese review.** All PT strings in `/prasa/` (and the hub's few `lang="pt"` passages) are machine-drafted placeholders explicitly pending native-speaker review. Who reviews, and does the hub adopt a PT-first policy later? (Google-Translate-assist is the current interim answer on the hub.)

**Q16 — Stations roadmap.** Which Prasa station opens first (Learn? Works?) and with what content source — hand-curated station pages or filtered views of hub data?

## Documentation hygiene (no decision needed, just permission)

**Q17 —** Decision-log entry 2026-05-31-004 still reads "Active — on branch v2-visual-foundation-1" though the work is merged and the branch deleted. OK to append a closing note? (The log's own rules imply entries are append-only.)
