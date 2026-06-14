#!/usr/bin/env node
// Resource Hub maintenance audit (Phase 1 — report only).
//
// Reads resources-data.json, inspects each listing for stale / expired /
// broken / verification-needed metadata, and writes a Markdown audit report
// plus a concise console summary.
//
// This is internal maintenance support. It NEVER changes, hides, removes, or
// publishes public listings. It only reports what a human should review.
//
// No third-party dependencies. Node 18+ (uses global fetch for opt-in
// --check-links only; the default run requires no network access).
//
// Usage:
//   node scripts/audit-resources.mjs [options]
//
// Options:
//   --data <path>        Path to data file (default: resources-data.json at repo root)
//   --out <path>         Markdown report output path (default: resource-audit-report.md)
//   --today <YYYY-MM-DD>  Override "today" (UTC) for deterministic runs/testing
//   --stale-days <n>     Default lastChecked staleness budget when a listing's
//                        maintenanceTier gives no clearer interval (default: 60)
//   --check-links        Opt-in lightweight link check (HEAD, fallback GET).
//                        Network failures are reported as warnings, never as
//                        removal triggers. Off by default so runs stay fast/offline.
//   --link-timeout <ms>  Per-link timeout for --check-links (default: 8000)
//   --fail-on-critical   Exit non-zero if any Critical findings exist (strict mode)
//   --quiet              Suppress the console summary (still writes the report)
//   --help               Show this help

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..');

// ---------------------------------------------------------------------------
// Argument parsing (tiny, no dependencies)
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const opts = {
    data: resolve(REPO_ROOT, 'resources-data.json'),
    out: resolve(process.cwd(), 'resource-audit-report.md'),
    today: null,
    staleDays: 60,
    checkLinks: false,
    linkTimeout: 8000,
    failOnCritical: false,
    quiet: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--data': opts.data = resolve(process.cwd(), next()); break;
      case '--out': opts.out = resolve(process.cwd(), next()); break;
      case '--today': opts.today = next(); break;
      case '--stale-days': opts.staleDays = Number(next()); break;
      case '--check-links': opts.checkLinks = true; break;
      case '--link-timeout': opts.linkTimeout = Number(next()); break;
      case '--fail-on-critical': opts.failOnCritical = true; break;
      case '--quiet': opts.quiet = true; break;
      case '--help': case '-h': opts.help = true; break;
      default:
        console.error(`Unknown option: ${a}`);
        opts.help = true;
    }
  }
  return opts;
}

const HELP = `Resource Hub maintenance audit (Phase 1 — report only)

Usage: node scripts/audit-resources.mjs [options]

  --data <path>         Data file (default: resources-data.json at repo root)
  --out <path>          Markdown report output (default: resource-audit-report.md)
  --today <YYYY-MM-DD>  Override "today" in UTC (deterministic runs)
  --stale-days <n>      Default lastChecked staleness budget (default: 60)
  --check-links         Opt-in lightweight link check (HEAD -> GET, timeout)
  --link-timeout <ms>   Per-link timeout for --check-links (default: 8000)
  --fail-on-critical    Strict mode: exit non-zero if any Critical findings
  --quiet               Suppress console summary
  --help                Show this help

This tool only reports. It never changes public listings.`;

// ---------------------------------------------------------------------------
// Date helpers (UTC, date-only)
// ---------------------------------------------------------------------------
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_ANYWHERE_RE = /\b(\d{4})-(\d{2})-(\d{2})\b/g;

function isIsoDate(s) {
  return typeof s === 'string' && ISO_DATE_RE.test(s) && !Number.isNaN(Date.parse(s));
}

// Returns the UTC day index (days since epoch) for an ISO date, or null.
function isoToDayIndex(s) {
  if (!isIsoDate(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

function todayDayIndex(overrideIso) {
  if (overrideIso) {
    const idx = isoToDayIndex(overrideIso);
    if (idx === null) {
      console.error(`Invalid --today value (expected YYYY-MM-DD): ${overrideIso}`);
      process.exit(1);
    }
    return idx;
  }
  const now = new Date();
  return Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
}

function dayIndexToIso(idx) {
  const ms = idx * 86400000;
  const dt = new Date(ms);
  return dt.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Field heuristics
// ---------------------------------------------------------------------------
const URL_RE = /^https?:\/\/.+/i;

// Maps a free-text maintenanceTier into a coarse review interval (days).
function intervalDaysForTier(tier, fallback) {
  const t = String(tier || '').toLowerCase();
  if (/week/.test(t) && /bi-?week/.test(t)) return 14;
  if (/bi-?week/.test(t)) return 14;
  if (/week/.test(t)) return 7;
  if (/month/.test(t)) return 31;
  if (/quarter/.test(t)) return 92;
  return fallback;
}

// A status string that implies the listing is presently open/active.
function isOpenNowStatus(s) {
  return /open now/i.test(String(s || ''));
}

// Date text that defers to the official site / has no concrete commitment.
const VAGUE_DATE_RE = /(check\s+(the\s+)?official|official\s+(course|provider|program)\s+page|vary|varies|usually available|always verify|self-?paced|periodically|announced|to be (announced|confirmed)|tbd)/i;

// Field names that represent a deadline / end of a window.
// Matched conservatively against concatenated camelCase tokens so that an
// *open*/start date (e.g. enrollmentOpenDate) is never mistaken for a deadline.
function isDeadlineKey(k) {
  return /(closedate|enddate|deadline|expir)/i.test(k);
}

// Field names that should hold a parseable date when present.
function isExpectedDateKey(k) {
  return /date$/i.test(k) || /deadline/i.test(k);
}

function weakLinkConfidence(v) {
  const s = String(v || '').trim().toLowerCase();
  return s === '' || s === 'low' || s === 'unknown';
}

function isOfficial(officiality) {
  return /official/i.test(String(officiality || ''));
}

function isHighPriorityOrFeatured(r) {
  const pri = String(r.priority || '').toLowerCase();
  const pub = String(r.publishStatus || '').toLowerCase();
  const promo = String(r.promotionReadiness || '').toLowerCase();
  return pri === 'high' || pri === 'watch' || pub === 'featured' || promo === 'featured';
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------
const SEVERITY_RANK = { Critical: 0, 'Expired / likely stale': 1, Watchlist: 2, 'Needs review': 3 };

function auditResources(resources, ctx) {
  const findings = [];
  const seenIds = new Map(); // id -> first index

  const add = (r, idx, category, issue, suggestedAction) => {
    findings.push({
      idx,
      id: typeof r.id === 'string' ? r.id : `(index ${idx})`,
      provider: r.provider,
      program: r.program,
      status: r.status || r.publicStatus || r.availability || '',
      url: r.url,
      category,
      issue,
      suggestedAction,
      rank: SEVERITY_RANK[category] ?? 9,
      highlight: isHighPriorityOrFeatured(r),
    });
  };

  resources.forEach((r, idx) => {
    // ---- Critical: id ----
    if (typeof r.id !== 'string' || r.id.trim() === '') {
      add(r, idx, 'Critical', 'Missing or malformed id', 'Assign a stable, unique id.');
    } else {
      if (seenIds.has(r.id)) {
        add(r, idx, 'Critical', `Duplicate id (also at index ${seenIds.get(r.id)})`,
          'Make ids unique; investigate accidental duplication.');
      } else {
        seenIds.set(r.id, idx);
      }
    }

    // ---- Critical: url ----
    if (typeof r.url !== 'string' || !URL_RE.test(r.url.trim())) {
      add(r, idx, 'Critical', 'Missing or malformed url', 'Add a valid http(s) URL.');
    }

    // ---- Critical: unparseable expected date fields ----
    for (const [k, v] of Object.entries(r)) {
      if (isExpectedDateKey(k) && typeof v === 'string' && v.trim() !== '' && !isIsoDate(v)) {
        add(r, idx, 'Critical', `Unparseable date field "${k}": "${v}"`,
          'Normalize to YYYY-MM-DD or move free text to a *Text field.');
      }
    }

    // ---- Needs review: explicit verification flag ----
    if (r.needsVerification === true) {
      add(r, idx, 'Needs review', 'needsVerification = true',
        `Re-verify on official source${r.verificationNote ? ` (note: ${r.verificationNote})` : ''}.`);
    }

    // ---- Needs review: overdue nextReviewDate ----
    const nextReviewIdx = isoToDayIndex(r.nextReviewDate);
    if (nextReviewIdx !== null && nextReviewIdx < ctx.today) {
      add(r, idx, 'Needs review', `nextReviewDate ${r.nextReviewDate} is in the past (${ctx.today - nextReviewIdx}d overdue)`,
        'Re-check the listing and set a new nextReviewDate.');
    }

    // ---- Needs review: stale lastChecked ----
    const lastCheckedIdx = isoToDayIndex(r.lastChecked);
    const interval = intervalDaysForTier(r.maintenanceTier, ctx.staleDays);
    const lastCheckedAge = lastCheckedIdx === null ? null : ctx.today - lastCheckedIdx;
    if (lastCheckedAge !== null && lastCheckedAge > interval) {
      add(r, idx, 'Needs review', `lastChecked ${r.lastChecked} is ${lastCheckedAge}d old (tier budget ~${interval}d)`,
        'Re-check the listing and update lastChecked.');
    }

    // ---- Needs review: "Open Now" but vague date text ----
    const openish = isOpenNowStatus(r.status) || isOpenNowStatus(r.publicStatus) || isOpenNowStatus(r.availability);
    const dateText = `${r.publicDateText || ''} ${r.dateWindow || ''}`;
    const hasConcreteDate = ISO_DATE_ANYWHERE_RE.test(dateText);
    ISO_DATE_ANYWHERE_RE.lastIndex = 0; // reset stateful global regex
    if (openish && VAGUE_DATE_RE.test(dateText) && !hasConcreteDate) {
      add(r, idx, 'Needs review', 'Status reads "Open Now" but date text is vague / defers to official site',
        'Confirm it is actively open and add concrete dates, or soften the status.');
    }

    // ---- Expired / likely stale: explicit deadline/end fields in the past ----
    for (const [k, v] of Object.entries(r)) {
      if (isDeadlineKey(k) && isIsoDate(v)) {
        const di = isoToDayIndex(v);
        if (di !== null && di < ctx.today) {
          add(r, idx, 'Expired / likely stale', `${k} ${v} has passed (${ctx.today - di}d ago)`,
            'Confirm whether a new cycle/date applies, then update or archive.');
        }
      }
    }

    // ---- Expired / likely stale: past ISO date embedded in date-window text ----
    const windowText = `${r.dateWindow || ''} ${r.publicDateText || ''}`;
    let m;
    ISO_DATE_ANYWHERE_RE.lastIndex = 0;
    while ((m = ISO_DATE_ANYWHERE_RE.exec(windowText)) !== null) {
      const di = isoToDayIndex(m[0]);
      if (di !== null && di < ctx.today) {
        add(r, idx, 'Expired / likely stale', `Date window text mentions past date ${m[0]}`,
          'Review the window text; it may reference an elapsed deadline.');
        break; // one finding per listing is enough
      }
    }

    // ---- Watchlist: high-priority/featured with overdue review metadata ----
    if (isHighPriorityOrFeatured(r)) {
      const overdueReview = nextReviewIdx !== null && nextReviewIdx < ctx.today;
      if (overdueReview || r.needsVerification === true) {
        add(r, idx, 'Watchlist', 'High-priority/featured listing has overdue review or pending verification',
          'Prioritize re-verification before further promotion.');
      }
    }

    // ---- Watchlist: weak/unknown linkConfidence ----
    if (weakLinkConfidence(r.linkConfidence)) {
      add(r, idx, 'Watchlist', `Weak/unknown linkConfidence ("${r.linkConfidence ?? ''}")`,
        'Confirm the destination URL still resolves to the intended listing.');
    }

    // ---- Watchlist: official/provider listing with stale lastChecked ----
    if (isOfficial(r.officiality) && lastCheckedAge !== null && lastCheckedAge > interval) {
      add(r, idx, 'Watchlist', `Official/provider listing lastChecked ${r.lastChecked} (${lastCheckedAge}d old)`,
        'Re-check the official source and update lastChecked.');
    }
  });

  return findings;
}

// ---------------------------------------------------------------------------
// Optional, opt-in lightweight link check (HEAD -> GET, timeout)
// ---------------------------------------------------------------------------
const USER_AGENT = 'ResourceHubAuditBot/1.0 (+maintenance link check; non-scraping)';

async function checkOneLink(url, timeoutMs) {
  const attempt = async (method) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: ctrl.signal,
        headers: { 'user-agent': USER_AGENT },
      });
      return { ok: res.ok || (res.status >= 200 && res.status < 400), status: res.status };
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    const head = await attempt('HEAD');
    if (head.ok) return { state: 'ok', status: head.status };
    // Some hosts reject HEAD; fall back to GET before concluding.
    const get = await attempt('GET');
    return get.ok ? { state: 'ok', status: get.status } : { state: 'warn', status: get.status };
  } catch (err) {
    return { state: 'warn', error: err.name === 'AbortError' ? 'timeout' : String(err.message || err) };
  }
}

async function checkLinks(resources, findings, timeoutMs) {
  // Unique URLs only, to be polite and fast.
  const urls = [...new Set(resources.map((r) => r.url).filter((u) => typeof u === 'string' && URL_RE.test(u)))];
  const byUrl = new Map();
  for (const r of resources) if (r.url) byUrl.set(r.url, r);
  const concurrency = 6;
  let i = 0;
  async function worker() {
    while (i < urls.length) {
      const url = urls[i++];
      const result = await checkOneLink(url, timeoutMs);
      if (result.state === 'warn') {
        const r = byUrl.get(url) || {};
        const idx = resources.indexOf(r);
        findings.push({
          idx,
          id: r.id || '(unknown)',
          provider: r.provider,
          program: r.program,
          status: r.status || r.publicStatus || '',
          url,
          category: 'Watchlist',
          issue: `link_check_warning: ${result.error || `HTTP ${result.status}`}`,
          suggestedAction: 'Manually open the URL; network warnings are not removal triggers.',
          rank: SEVERITY_RANK.Watchlist,
          highlight: isHighPriorityOrFeatured(r),
        });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------
const CATEGORIES = ['Critical', 'Expired / likely stale', 'Needs review', 'Watchlist'];

function cell(v) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

function truncate(s, n) {
  s = cell(s);
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function tableFor(rows) {
  if (rows.length === 0) return '_None found._\n';
  const header =
    '| id | provider | program | status/publicStatus | issue | suggestedAction | url |\n' +
    '| --- | --- | --- | --- | --- | --- | --- |\n';
  const body = rows
    .map((f) =>
      `| ${cell(f.id)} | ${truncate(f.provider, 40)} | ${truncate(f.program, 60)} | ${cell(f.status)} | ${truncate(f.issue, 120)} | ${truncate(f.suggestedAction, 120)} | ${cell(f.url)} |`)
    .join('\n');
  return `${header}${body}\n`;
}

function buildReport(findings, ctx, meta) {
  const counts = {};
  for (const c of CATEGORIES) counts[c] = findings.filter((f) => f.category === c).length;
  const distinctFlagged = new Set(findings.map((f) => f.idx)).size;

  const lines = [];
  lines.push('# Resource Hub Maintenance Audit');
  lines.push('');
  lines.push(`**Audit date (UTC):** ${dayIndexToIso(ctx.today)}${ctx.todayOverride ? ' _(overridden via --today)_' : ''}`);
  lines.push(`**Date basis:** all "before today" comparisons use UTC calendar dates.`);
  lines.push(`**Resources inspected:** ${meta.total}`);
  lines.push(`**Distinct resources flagged:** ${distinctFlagged} of ${meta.total}`);
  if (ctx.checkLinks) lines.push(`**Link check:** opt-in (--check-links) ran; network warnings are advisory only.`);
  lines.push('');
  lines.push('> _Internal maintenance support only. This report does **not** automatically change, hide, remove, or publish any public listing. Every item is a human review prompt._');
  lines.push('');

  // Summary counts
  lines.push('## Counts by category');
  lines.push('');
  lines.push('| Category | Findings |');
  lines.push('| --- | --- |');
  for (const c of CATEGORIES) lines.push(`| ${c} | ${counts[c]} |`);
  lines.push(`| **Total findings** | **${findings.length}** |`);
  lines.push('');

  // Top priority items
  const top = [...findings]
    .filter((f) => f.rank <= 1 || (f.highlight && f.rank <= 3))
    .sort((a, b) => a.rank - b.rank || String(a.id).localeCompare(String(b.id)))
    .slice(0, 30);
  lines.push('## Top priority items needing review');
  lines.push('');
  lines.push(`_Highest-severity findings first (max 30 shown). Full lists by category below._`);
  lines.push('');
  lines.push(tableFor(top));

  // Per-category sections
  for (const c of CATEGORIES) {
    const rows = findings
      .filter((f) => f.category === c)
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));
    lines.push(`## ${c} (${rows.length})`);
    lines.push('');
    lines.push(tableFor(rows));
  }

  lines.push('---');
  lines.push('');
  lines.push('### Notes & limitations');
  lines.push('- Categories overlap by design: one listing can appear in several (e.g. an overdue, featured listing).');
  lines.push('- Staleness budgets are derived loosely from `maintenanceTier` text, falling back to `--stale-days`.');
  lines.push('- Date-window text scanning only flags machine-readable ISO dates (`YYYY-MM-DD`); prose-only windows are not inferred.');
  lines.push('- Link warnings (if `--check-links` was used) reflect network reachability, not content correctness, and are never removal triggers.');
  lines.push('');
  return { report: lines.join('\n'), counts, distinctFlagged };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(HELP);
    process.exit(0);
  }

  // Read + parse (structural failures are real failures -> exit 1).
  let raw;
  try {
    raw = readFileSync(opts.data, 'utf8');
  } catch (err) {
    console.error(`ERROR: cannot read data file at ${opts.data}: ${err.message}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`ERROR: resources-data.json did not parse as JSON: ${err.message}`);
    process.exit(1);
  }

  const resources = data && typeof data === 'object' && Array.isArray(data.resources) ? data.resources : null;
  if (!resources) {
    console.error('ERROR: expected a top-level "resources" array. Data shape did not match — stopping.');
    process.exit(1);
  }

  const todayOverride = Boolean(opts.today);
  const ctx = {
    today: todayDayIndex(opts.today),
    todayOverride,
    staleDays: Number.isFinite(opts.staleDays) ? opts.staleDays : 60,
    checkLinks: opts.checkLinks,
  };

  const findings = auditResources(resources, ctx);

  if (opts.checkLinks) {
    if (typeof fetch !== 'function') {
      console.error('WARNING: --check-links requested but global fetch is unavailable (need Node 18+). Skipping link check.');
    } else {
      await checkLinks(resources, findings, opts.linkTimeout);
    }
  }

  const { report, counts, distinctFlagged } = buildReport(findings, ctx, { total: resources.length });

  try {
    writeFileSync(opts.out, report, 'utf8');
  } catch (err) {
    console.error(`ERROR: could not write report to ${opts.out}: ${err.message}`);
    process.exit(1);
  }

  if (!opts.quiet) {
    console.log('Resource Hub Maintenance Audit');
    console.log(`  Audit date (UTC):   ${dayIndexToIso(ctx.today)}${todayOverride ? ' (overridden)' : ''}`);
    console.log(`  Resources inspected: ${resources.length}`);
    console.log(`  Distinct flagged:    ${distinctFlagged}`);
    for (const c of CATEGORIES) console.log(`  ${c.padEnd(24)} ${counts[c]}`);
    console.log(`  Report written:      ${opts.out}`);
  }

  const criticalCount = counts.Critical;
  if (opts.failOnCritical && criticalCount > 0) {
    console.error(`Strict mode: ${criticalCount} Critical finding(s) — exiting non-zero.`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(`Unexpected error: ${err && err.stack ? err.stack : err}`);
  process.exit(1);
});
