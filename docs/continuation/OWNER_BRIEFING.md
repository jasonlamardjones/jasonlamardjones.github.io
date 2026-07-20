# Owner Briefing — PR #41 and the Next 14 Days

**Date:** 2026-07-20 · **For:** repository owner · **Scope:** decision support only; no code changed by this document.
PR under review: https://github.com/jasonlamardjones/jasonlamardjones.github.io/pull/41

---

## 1. PR #41 — approve, reject, or verify

**Approve (safe as-is):**
- The two HTML edits (3 `<img>` tags total): lazy-loading attributes only. No layout, text, navigation, data, or disclaimer changes anywhere in the PR.
- The `docs/continuation/` package (7 files including this one): documentation only.

**Verify before merging (your judgment, ~10 min, steps in §6):**
- The two recompressed hero images (`hub-hero-labeled.jpg`, `opportunity-pathways-landscape.jpg`) look clean to your eye. Measured difference is tiny, but you are the final judge of your own artwork.
- The docs contain nothing you consider private. They were written public-safe (technical facts only), but only you know your full sensitivity list.

**Reject:** nothing. There is no risky or speculative change in this PR. If anything beyond the 11 files listed in §6 appears in "Files changed", stop and ask.

## 2. Five highest-risk findings on the LIVE site today

1. **Three listings say "Available now" for courses that ended 2026-06-29** (UNI-023/024/025, OPEN MOOCs). A user acting on them hits a dead end — direct hit to the hub's core trust promise. Fix is queued as backlog C1 with a copy-ready prompt.
2. **The whole resource database is ~5 weeks past its own review dates** (197 of 201 listings flagged; last checks cluster mid-May). The freshness the hub promises is currently not being delivered.
3. **Mobile page weight** — until PR #41 merges, the directory page ships ~4.9 MB (mostly images hidden in a collapsed panel) — the under-60-second promise fails on slow connections. Merging PR #41 largely fixes this.
4. **Fragile update mechanics:** the data version string must be hand-bumped in three places; duplicated scripts across hub pages have already drifted. Next data update has real odds of a silent stale-cache or inconsistency bug.
5. **Dead-end URLs:** no `404.html` (and no favicon), so mistyped or legacy links land on GitHub's default error page with no way back to the hub.

## 3. Five highest-value tasks for the next 14 days

1. **Review and merge PR #41** (§6 below) — ships the mobile-speed win.
2. **Backlog C1:** correct the three expired MOOC listings (+ CV-097 wording). Prompt ready in `NEXT_MODEL_HANDOFF.md` §5 Task 1; safe fallback needs no research.
3. **Backlog C2, bounded first pass:** re-verify just the 53 `Featured` listings (not all 201) and update their `lastChecked`/`nextReviewDate` — restores freshness where users actually look first.
4. **Backlog N1:** compress/convert the remaining heavy images and decide on deleting the two unused multi-MB files (`headshot.png`, `hero-banner.png`).
5. **Backlog N5:** add `404.html` + favicon (small, zero-risk, closes finding #5).

After these, the next technical priorities are N3 (move runtime data patches into the JSON) and N2 (shared hub script) — prompts for both are in the handoff.

## 4. Task ownership by project

*Assumption (correct me if the numbering differs): Project 03 = A Prasa (business/brand) · Project 04 = Resource Hub (product/curation) · Project 05 = Website & GitHub Technical Operations.*

- **Project 03 — A Prasa:** no code tasks now. Owns decisions Q13–Q16 (brand name / Rename Day, publish-and-link timing, commissioning native Portuguese review, station roadmap). Prototype stays frozen, unlinked, sample-data-only until these land.
- **Project 04 — Resource Hub:** C1 and C2 (data corrections and curation sweep), plus decisions Q1–Q2 (MOOC facts, curation cadence), Q5 (events source of truth), Q7 (pathway definitions), Q8 (zero-result behavior), and sign-off on the Q3 data-split schema. Later: content for Pathways (L2) and Organizations (L3).
- **Project 05 — Technical Operations:** merge/deploy PR #41, N1 (images), N5 (404/favicon), N3, N4, N2 (refactors), maintaining the audit CI, and executing the Q3 split once Project 04 signs off the schema.

## 5. The 17 open questions — what actually blocks work now

**Answer this week (they gate the 14-day list):**
- **Q11** delete the two dead image files? (gates part of N1)
- **Q12** is a numeric quality threshold enough for image conversion, or do you want to eyeball each? (gates N1)
- **Q2** who curates, on what rhythm? (gates C2 beyond the first pass)
- **Q1** MOOC next-cycle facts — *soft* block only; the "Check next dates" fallback ships without it.
- **Q8** accept the existing quick-path buttons as zero-result v1? A one-word "yes" turns L4 into a ready task.

**Answer before starting the related project, not before:** Q3 (data-split schema → L1), Q5 (events → L6), Q6 (home-redesign scope → L5), Q7 (pathway definitions → L2).

**Whenever convenient (nothing waits on them):** Q4 (hidden listing CV-015), Q9 (mobile nav pattern), Q10 (analytics on the four professional pages), Q17 (closing note in the decision log).

**Parked with A Prasa (Project 03):** Q13–Q16.

## 6. 30-minute PR #41 review — no developer tools needed

All steps happen on the GitHub website, signed in.

1. **(2 min) Open the PR → "Files changed" tab.** Confirm the file list is exactly: `resources.html`, `resources-directory.html`, `hub-hero-labeled.jpg`, `opportunity-pathways-landscape.jpg`, and seven files under `docs/continuation/`. Anything else → stop, comment on the PR, don't merge.
2. **(3 min) Check the two HTML diffs.** Each shows one changed line where the red (old) and green (new) versions differ only by `loading="lazy" decoding="async"` being added, or `eager` becoming `lazy`. No wording or link changes.
3. **(5 min) Check the two images.** Click each `.jpg` in Files changed; GitHub shows before/after (use the "Swipe" or "2-up" view). The new versions should look identical — no blur, no blocky patches. Zoom if unsure.
4. **(10 min) Skim the seven docs** in `docs/continuation/`. You're checking one thing: nothing appears that you consider private (these files are public once merged). Technical detail you don't follow is fine to ignore.
5. **(2 min) Merge.** Green "Merge pull request" button → confirm. The site republishes automatically in ~1–2 minutes.
6. **(8 min) Phone check on the live site.** On your phone, open `jasonlamard.com/resources.html` and `…/resources-directory.html`: pages look unchanged, load noticeably faster on mobile data, the two hero illustrations look crisp, and in the directory's "Need to build your foundation first?" panel, opening **"View sample pathway"** still shows the two pathway images after a moment.
7. **If anything is wrong:** open the merged PR page → "Revert" button → merge the revert PR. The site returns to its previous state in ~2 minutes. Nothing is lost; the change can be re-examined later.

## 7. Restart prompt for the next Claude Code session

> In `jasonlamardjones/jasonlamardjones.github.io`, read `AGENTS.md` and all files in `docs/continuation/` before doing anything — they contain a completed 2026-07-20 audit, architecture map, backlog, and rules; do not re-audit the repository. Check whether PR #41 (branch `claude/fable5-audit-continuation-f388ee`) has been merged: if yes, branch fresh from `main`; if no, ask me whether to continue on that branch or wait. Then execute Task 1 from `NEXT_MODEL_HANDOFF.md` §5 (fix expired MOOC listings UNI-023/024/025 and CV-097 in `resources-data.json`, with the three-place version bump), following the verification steps in `TEST_AND_DEPLOYMENT_CHECKLIST.md`, and open a PR without merging. If I've answered any questions from `OWNER_BRIEFING.md` §5 in my message, apply those answers; otherwise make no product or business decisions on your own.
