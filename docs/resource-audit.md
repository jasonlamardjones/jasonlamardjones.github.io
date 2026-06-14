# Resource Hub Maintenance Audit (Phase 1)

Internal tooling that helps a human reviewer find stale, expired, broken, or
verification-needed listings in `resources-data.json`.

**This is report-only.** It never changes, hides, removes, or publishes any
public listing. Every finding is a prompt for a person to review — nothing is
applied automatically. The Resource Hub keeps its independent, non-official
posture; this tooling supports independent curation, it does not alter public
UI, routing, search/filter, saved-resource, translation, or analytics behavior.

## Running locally

No dependencies and no network access are required for the default run
(Node 18+):

```bash
node scripts/audit-resources.mjs
```

This writes `resource-audit-report.md` (git-ignored) and prints a console
summary.

### Useful options

| Option | Purpose |
| --- | --- |
| `--data <path>` | Use a different data file (default: `resources-data.json`). |
| `--out <path>` | Report output path (default: `resource-audit-report.md`). |
| `--today <YYYY-MM-DD>` | Override "today" in UTC for deterministic runs. |
| `--stale-days <n>` | Fallback `lastChecked` staleness budget (default: 60). |
| `--check-links` | Opt-in lightweight link check (HEAD → GET, timeout). |
| `--link-timeout <ms>` | Per-link timeout for `--check-links` (default: 8000). |
| `--fail-on-critical` | Strict mode: exit non-zero if any Critical findings. |
| `--quiet` | Suppress the console summary. |
| `--help` | Show usage. |

## What it checks

All "before today" comparisons use UTC calendar dates.

- **Critical** — missing/malformed `id`, duplicate `id`, missing/malformed
  `url`, and unparseable values in expected date fields.
- **Needs review** — `needsVerification === true`, overdue `nextReviewDate`,
  stale `lastChecked` (budget derived loosely from `maintenanceTier`), and
  "Open Now" status paired with vague date text that defers to the official
  site.
- **Expired / likely stale** — explicit deadline/end date fields in the past,
  and date-window text that mentions a past machine-readable ISO date.
- **Watchlist** — high-priority/featured listings with overdue review metadata,
  weak/unknown `linkConfidence`, and official/provider listings with stale
  `lastChecked`.

Categories overlap by design: a single listing may appear in more than one.

## Link checking

`--check-links` is opt-in and conservative: it issues a `HEAD` request, falls
back to `GET`, applies a timeout, and sends a descriptive user agent. It does
**not** scrape or crawl provider pages and does not use third-party APIs.
Network failures are reported as `link_check_warning` advisories only — never
as removal triggers.

## Automation

`.github/workflows/resource-audit.yml` runs weekly (Monday 07:00 UTC) and on
manual `workflow_dispatch`. It runs the script, writes the Markdown report to
the GitHub Actions step summary, and uploads it as an artifact. The optional
link check can be enabled per manual run via the `check_links` input.

## Roadmap

Phase 1 is detection only. A likely next PR is a separate
data-cleanup/normalization change (for example, normalizing date text and
trimming archived listings) — kept distinct so this tooling change stays small
and reviewable.
