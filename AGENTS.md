# AGENTS.md

## Project Scope
This repository powers the independent personal website of Jason L. Jones and its Learning & Career Resource Hub.

## Core Governance Rules
1. **Independent / Non-Official Boundary**
   - Keep all content and edits aligned with an independent, non-official project posture.
   - Do not imply institutional endorsement, official certification authority, or formal affiliation unless explicitly stated in existing repository text.

2. **No Redesign Without Explicit Request**
   - Do not redesign layouts, visual systems, information architecture, typography, color palettes, or component styling unless the prompt explicitly asks for a redesign.
   - Default to preserving existing UX/UI patterns.

3. **Minimal, Focused Patches Only**
   - Apply the smallest viable change set that satisfies the request.
   - Avoid opportunistic refactors and broad cleanup outside the requested scope.

4. **Preserve Resource Hub Navigation and Protected Layouts**
   - Preserve Learning & Career Resource Hub navigation structure, route behavior, section hierarchy, and protected layout patterns.
   - Do not alter global navigation semantics or hub-specific layout contracts unless explicitly requested.

5. **Mobile-First Usability**
   - Any UI-impacting change must preserve or improve mobile-first usability.
   - Do not introduce regressions in small-screen readability, tap targets, spacing, or navigation flow.

6. **Do Not Edit Unrelated Files**
   - Limit edits strictly to files required for the task.
   - Do not modify unrelated files for style, formatting, or incidental fixes.

7. **Do Not Remove Trust / Disclaimer Language**
   - Preserve existing trust, safety, disclosure, and disclaimer language.
   - Any requested change to trust/disclaimer content should be treated as high-sensitivity and changed only when explicitly instructed.

## Required Process Before Editing
Before making file changes, provide a concise pre-edit plan that includes:
- **Patch type** (e.g., content update, bug fix, governance setup)
- **Allowed files** to be edited
- **Risks / regressions to watch for**
- **Regression tests/checks** that will be run

## Required Process After Editing
After making file changes, provide:
- **Changed files list**
- **Exact change summary** per file
- **Validation checks run** and outcomes

## Change Control Expectations
- If a requested change conflicts with these rules, pause and explicitly call out the conflict.
- Ask for confirmation before proceeding with actions that would violate no-redesign, trust/disclaimer preservation, or protected Resource Hub structure constraints.
