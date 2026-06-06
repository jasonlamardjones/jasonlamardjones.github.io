# Social Cuts Completion Report
**Campaign:** American Space Mindelo / America250  
**Produced:** 2026-06-06  
**Branch:** claude/mindelo-social-cuts-Zr9TT

---

## Files Inspected

| File | Purpose |
|---|---|
| `poster-source/.../01_main_initiative_independence_opportunity_future.png` | Header strip source (canonical logo treatment) |
| `poster-source/.../02_workshop_1_what_do_i_want_to_build.png` | Reviewed for content and visual identity |
| `poster-source/.../03_workshop_2_find_your_next_step.png` | Reviewed — **Resource Hub** text found and excluded from social cuts |
| `poster-source/.../04_workshop_3_three_pathways_to_opportunity.png` | Reviewed for content |
| `poster-source/.../05_final_week_activities_corrected_header.png` | Used per MANIFEST note (corrected header) |
| `poster-source/.../06_elibraryusa_access_workshop.png` | Reviewed — 10,000+ claim and ProQuest/Flipster/Libby logos excluded from social cuts |
| `america250-mindelo.html` | Authoritative copy source: event dates, registration URL, Portuguese text |
| `mindelo-composite.jpg` | Background photo (golden-hour panorama) |
| `mindelo-banner.jpg` | Background photo (daytime panorama) |
| `american-spaces.jpg` | Background photo (UniCV building, used for eLibraryUSA cut) |

---

## Source Assets Used in Production

| Asset | Usage |
|---|---|
| `poster-source/.../01_main_...png` | Header strip cropped (y=0–165), scaled to 1080px wide — used in all 12 cuts |
| `mindelo-composite.jpg` | Background for 01_main, 03_workshop2, 05_finalweek (golden-hour) |
| `mindelo-banner.jpg` | Background for 02_workshop1, 04_workshop3 (daytime panorama) |
| `american-spaces.jpg` | Background for 06_elibrary (UniCV building) |
| `america250-mindelo.html` | Registration URL (QR target), all Portuguese event copy |
| System fonts: DejaVu Sans Bold + Regular | All on-image text rendering |

---

## Files Created

| File | Dimensions | Notes |
|---|---|---|
| `social-cuts/01_main_square.png` | 1080×1080 | Main initiative overview |
| `social-cuts/01_main_story.png` | 1080×1920 | Main initiative overview |
| `social-cuts/02_workshop1_square.png` | 1080×1080 | Workshop 1: O Que Quero Construir? |
| `social-cuts/02_workshop1_story.png` | 1080×1920 | Workshop 1 |
| `social-cuts/03_workshop2_square.png` | 1080×1080 | Workshop 2: Encontre o Seu Próximo Passo |
| `social-cuts/03_workshop2_story.png` | 1080×1920 | Workshop 2 |
| `social-cuts/04_workshop3_square.png` | 1080×1080 | Workshop 3: Três Caminhos para a Oportunidade |
| `social-cuts/04_workshop3_story.png` | 1080×1920 | Workshop 3 |
| `social-cuts/05_finalweek_square.png` | 1080×1080 | Semana Final: Atividades de Comunidade, Inglês e Cultura |
| `social-cuts/05_finalweek_story.png` | 1080×1920 | Semana Final |
| `social-cuts/06_elibrary_square.png` | 1080×1080 | eLibraryUSA Access Workshop |
| `social-cuts/06_elibrary_story.png` | 1080×1920 | eLibraryUSA Access Workshop |
| `social-cuts/00_contact_sheet.png` | 2138×1121 | All 12 cuts in a single overview grid |
| `social-cuts/mindelo_america250_social_cuts.zip` | ~12 MB | All 12 PNGs + contact sheet |

---

## Exact On-Image Text Per Asset

All cuts share:
- **Header**: extracted from poster 01 — "American Space Mindelo" + US flag diamond logo + UniCV logo + FCSHA logo
- **CTA (all cuts)**: `Digitalize para inscrição, horários e detalhes` (formal/neutral Portuguese)

| Cut | Badge (pill) | Date | PT Headline | EN Subtitle | Body text |
|---|---|---|---|---|---|
| 01_main | America250 · 1776–2026 | Junho – Julho 2026 | Independência, Oportunidade e o Futuro | Independence, Opportunity & the Future | — |
| 02_workshop1 | Workshop 1 | Quinta-feira, 11 de junho | O Que Quero Construir? | What Do I Want to Build? | — |
| 03_workshop2 | Workshop 2 | Quinta-feira, 18 de junho | Encontre o Seu Próximo Passo | Find Your Next Step | Recursos gratuitos, ferramentas digitais e oportunidades online |
| 04_workshop3 | Workshop 3 | Terça-feira, 23 de junho | Três Caminhos para a Oportunidade | Three Pathways to Opportunity | Aprendizagem · Competências · Conexão com a comunidade |
| 05_finalweek | Semana Final | 1 – 3 de julho de 2026 | Atividades de Comunidade, Inglês e Cultura | Final Week Activities | Cultura, conversa e comunidade |
| 06_elibrary | eLibraryUSA | Data a confirmar | Workshop de Acesso ao eLibraryUSA | eLibraryUSA Access Workshop | Milhares de livros, audiolivros e recursos |

**06_elibrary additional on-image note:**  
`⚑ PENDENTE: data e acesso a confirmar pelo coordenador`

---

## QR Code Status

- **Status: FINAL (confirmed URL)**
- QR target URL: `https://docs.google.com/forms/d/e/1FAIpQLSdDSi2hQ3gSc6ta1KrXQYCocYOejyoZ9pVfSa6PjbferfmIvw/viewform`
- Source: confirmed in `america250-mindelo.html` (registration `<a href>` links, multiple occurrences)
- All 12 cuts use the same registration QR (appropriate — the form is the single entry point for all sessions)

---

## QA Performed

| Check | Result |
|---|---|
| Opened 01_main_square (1080×1080) and verified | PASS |
| Opened 01_main_story (1080×1920) and verified | PASS |
| Opened 06_elibrary_square — eLibraryUSA pending note visible | PASS |
| Opened 06_elibrary_story — pending note visible, QR not covered | PASS |
| Opened 05_finalweek_square — July 4 not mentioned | PASS |
| Contact sheet shows all 12 cuts in grid | PASS |
| All squares: 1080×1080 confirmed | PASS |
| All stories: 1080×1920 confirmed | PASS |
| No text clipped (all headlines fit within margins) | PASS |
| CTA "Digitalize para inscrição, horários e detalhes" visible in all cuts | PASS |
| QR not covered by any text or waterfront band | PASS |
| Story: CTA text above QR with gap (no overlap after fix) | PASS |
| Header strip consistent across all 12 cuts (extracted from poster 01) | PASS |
| "American Space Mindelo" singular throughout | PASS |
| No "Resource Hub" in on-image text | PASS — workshop 2 body re-written |
| No Jason website URL in any image | PASS |
| No Jason brand mark or "by Jason Jones" in any image | PASS |
| July 4 invite-only: not promoted in any social cut | PASS — 05_finalweek covers 1–3 Jul only |
| eLibraryUSA: no "10,000+" claim on-image | PASS — uses "milhares de livros, audiolivros e recursos" |
| eLibraryUSA: no ProQuest/Flipster/Libby logos | PASS — no third-party logos present |
| eLibraryUSA: pending flag visible on-image | PASS |
| No Djan Djan, BBQ, alcohol, café, or private venue details | PASS — none present |
| Portuguese leads; English is secondary | PASS |
| Layering order: background → scrim → header → text → QR | PASS |
| Waterfront band does not cover text or CTA | PASS |
| QR is large and scannable (196px square / 240px story) | PASS |
| Bottom safe margins respected | PASS — 48px square, 130px story |

---

## Known Unresolved Items (Stop-Condition Flags)

These items were pending at the time of production. Do not release publicly until resolved with the local coordinator.

### 1. eLibraryUSA — Date not confirmed
- **Status:** PENDING
- The eLibraryUSA Access Workshop date is "TBC" in the HTML.
- On-image text says "Data a confirmar" and the pending flag note is visible.
- **Action required:** Coordinator must confirm date before promoting the eLibraryUSA cut.

### 2. eLibraryUSA — Access/activation process not confirmed
- **Status:** PENDING
- The account activation process (how participants get access) is not confirmed.
- Social cuts do not include any account/activation steps.
- **Action required:** Coordinator confirmation required before publishing eLibraryUSA cut.

### 3. eLibraryUSA — "10,000+" resource count not confirmed
- **Status:** NOT USED
- Poster 06 draft claimed "Access 10,000+ free books, audiobooks & learning resources."
- Social cut 06 uses "Milhares de livros, audiolivros e recursos" (safer wording).
- **Action required:** Coordinator to confirm exact count before using specific figure.

### 4. ProQuest / Flipster / Libby logo usage not confirmed
- **Status:** NOT INCLUDED
- These brand marks appear in poster 06 draft but usage is not confirmed.
- No third-party logos appear in any social cut.
- **Action required:** Confirm with partners before adding brand marks.

### 5. Portuguese/Cabo Verde reviewer sign-off
- **Status:** PENDING
- All on-image Portuguese text uses formal/neutral European Portuguese.
- Local Cabo Verdean reviewer should verify before public release.
- Informal "tu" captions (for post copy) were NOT placed on-image and remain in draft.

### 6. Workshop 3 — Content discrepancy between poster and HTML
- **Status:** Flagged
- Poster 04 lists "English for Tourism / Career Development / Business & Entrepreneurship" as the three pathways.
- HTML source lists "learning, skills, community connection" as the three pathways.
- Social cut 04 follows the HTML ("Aprendizagem · Competências · Conexão com a comunidade").
- **Action required:** Coordinator to confirm which description is current and correct.

### 7. No standalone "American Space Mindelo" official logo file available
- **Status:** Resolved by extraction
- No separate SVG/PNG for the "American Space Mindelo" mark was in the repo.
- Header strip was extracted from poster 01 (canonical header) — treated as the approved header treatment.
- If an official separate logo file is provided later, it should replace the extracted strip.

---

## Layering / Design Notes

- Layering order used: background photo → saturation/brightness reduction → navy gradient scrim → header strip (white, top) → red accent bar → text content → QR code with cream frame
- Fonts: DejaVu Sans Bold (headlines, badges, dates) + DejaVu Sans Regular (body, CTA) — full Portuguese diacritic support (á, é, ê, ã, õ, etc.)
- Color palette follows campaign CSS: navy #0C2040, gold #C09440, red #B22234 (US flag)
- QR frame: cream (#FFFDF8) matching campaign paper color
- AI-generated text was NOT used; all text rendered code-side with Python/Pillow
