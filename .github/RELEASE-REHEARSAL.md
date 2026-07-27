# A Prasa Controlled Public-Release Rehearsal R1

**Status:** Synthetic documentation-only release candidate. **Not production authority.**

## Purpose

This file exists solely to rehearse the controlled transfer of one reviewed, public-safe artifact from private development into a public-repository pull request. It does not introduce a product feature, production content, resource record, deployment change, or operational process.

## Controlled source

- Private source path: `release-candidates/rehearsal-001/PUBLIC-RELEASE-REHEARSAL.md`
- Approved private baseline before this candidate: `ca57f6e2d5d369c0b9564082b53bd281f4e7d3c8`
- Intended public target after separate authorization: `.github/RELEASE-REHEARSAL.md`
- The exact private candidate commit and blob identifiers are recorded in controlled Trello and CWOS evidence before any public transfer.

## Public-safe scope

This candidate contains only synthetic release-process documentation. It contains no credentials, personal information, private contacts, operational records, confidential notes, production data, or unpublished product material.

## Explicit exclusions

The rehearsal must not change:

- website pages, scripts, styles, or assets
- Resource Hub data or resource records
- the public `/prasa/` prototype
- analytics or monitoring configuration
- GitHub Actions workflows
- `CNAME`, domain, hosting, or deployment configuration
- repository visibility or access

## Evidence required before public transfer

- Private pull request contains exactly this one added file.
- Secret and personal-data checks find no matches.
- The approved candidate blob identifier is recorded.
- A separate approval authorizes creation of the public branch and draft pull request.

## Evidence required in the public pull request

- The public pull request adds only `.github/RELEASE-REHEARSAL.md`.
- The public file content exactly matches this approved candidate.
- Website, Resource Hub, workflow, domain, and deployment files have zero diff.
- Critical live pages remain available and behaviorally unchanged.

## Rollback

Before a public merge, close the draft pull request and delete only its unmerged branch. After a public merge, revert the rehearsal pull request if any unintended repository or live-site effect appears.

## Approval boundary

This candidate does not authorize a private merge, a public-repository branch, a public pull request, or a public merge. Each action remains separately approval-gated in Trello.
