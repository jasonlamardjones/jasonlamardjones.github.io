#!/usr/bin/env python3
"""
Generate social media cuts for American Space Mindelo / America250 campaign.

Source assets used:
  Poster header strip  — extracted from 01_main_initiative_independence_opportunity_future.png
  Photo backgrounds:
    mindelo-composite.jpg  (golden-hour panorama)
    mindelo-banner.jpg     (daytime panorama)
    american-spaces.jpg    (UniCV building — eLibraryUSA cut)

QR target URL: confirmed from america250-mindelo.html (Google Forms registration link).

Copy rules applied:
  - "American Space Mindelo" singular throughout.
  - No "Resource Hub" in visible on-image copy.
  - eLibraryUSA: "milhares de livros, audiolivros e recursos" (NOT "10,000+").
  - July 4 is invite-only; not promoted in any social cut.
  - Final-week cut covers 1–3 July only.
  - eLibraryUSA cut flagged as PENDING (date + access not confirmed).
  - No ProQuest / Flipster / Libby logos (not confirmed for use).
  - CTA on-image: formal/neutral Portuguese.
  - No Jason website URL visible.
"""

import os
import sys
import zipfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

import qrcode
from qrcode.constants import ERROR_CORRECT_H

# ── Paths ─────────────────────────────────────────────────────────────────────
REPO = "/home/user/jasonlamardjones.github.io"
POSTER_DIR = os.path.join(
    REPO,
    "poster-source",
    "american_space_mindelo_final_draft_claude_review_pack",
    "flyer_png_drafts",
)
OUT_DIR = os.path.join(REPO, "social-cuts")
os.makedirs(OUT_DIR, exist_ok=True)

# Source poster used for header extraction
POSTER_01 = os.path.join(POSTER_DIR, "01_main_initiative_independence_opportunity_future.png")

# Photo backgrounds (real photos, not AI-generated poster backgrounds)
IMG_COMPOSITE = os.path.join(REPO, "mindelo-composite.jpg")   # golden hour
IMG_BANNER    = os.path.join(REPO, "mindelo-banner.jpg")       # daytime panorama
IMG_SPACES    = os.path.join(REPO, "american-spaces.jpg")      # UniCV building

# Fonts (DejaVu — handles Portuguese diacritics cleanly)
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG  = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# ── Palette ───────────────────────────────────────────────────────────────────
NAVY     = (12,  32,  64)
GOLD     = (192, 148, 64)
GOLD_LT  = (255, 215, 130)
RED_US   = (178, 34,  52)
WHITE    = (255, 255, 255)
CREAM    = (255, 253, 248)

# ── Registration URL (confirmed in america250-mindelo.html) ───────────────────
REG_URL = (
    "https://docs.google.com/forms/d/"
    "e/1FAIpQLSdDSi2hQ3gSc6ta1KrXQYCocYOejyoZ9pVfSa6PjbferfmIvw/viewform"
)

CTA_ON_IMAGE = "Digitalize para inscrição,\nhorários e detalhes"
INSTITUTION  = "American Space Mindelo / UniCV"

# ── Dimensions ────────────────────────────────────────────────────────────────
SQ    = (1080, 1080)
STORY = (1080, 1920)

# ── Slot definitions ──────────────────────────────────────────────────────────
# (stem, bg_img, badge_label, pt_headline, en_subtitle, date_pt, body_pt,
#  pending_note, is_pending)
SLOTS = [
    (
        "01_main",
        IMG_COMPOSITE,
        "America250 · 1776–2026",
        "Independência,\nOportunidade\ne o Futuro",
        "Independence, Opportunity & the Future",
        "Junho – Julho 2026",
        None,
        None,
        False,
    ),
    (
        "02_workshop1",
        IMG_BANNER,
        "Workshop 1",
        "O Que Quero\nConstruir?",
        "What Do I Want to Build?",
        "Quinta-feira, 11 de junho",
        None,
        None,
        False,
    ),
    (
        "03_workshop2",
        IMG_COMPOSITE,
        "Workshop 2",
        "Encontre o Seu\nPróximo Passo",
        "Find Your Next Step",
        "Quinta-feira, 18 de junho",
        # No "Resource Hub" — rule applied
        "Recursos gratuitos,\nferramentas digitais\ne oportunidades online",
        None,
        False,
    ),
    (
        "04_workshop3",
        IMG_BANNER,
        "Workshop 3",
        "Três Caminhos\npara a Oportunidade",
        "Three Pathways to Opportunity",
        "Terça-feira, 23 de junho",
        "Aprendizagem · Competências\n· Conexão com a comunidade",
        None,
        False,
    ),
    (
        "05_finalweek",
        IMG_COMPOSITE,
        "Semana Final",
        "Atividades de\nComunidade,\nInglês e Cultura",
        "Final Week Activities",
        "1 – 3 de julho de 2026",
        # July 4 is invite-only — not promoted; only 1-3 Jul covered
        "Cultura, conversa e comunidade",
        None,
        False,
    ),
    (
        "06_elibrary",
        IMG_SPACES,
        "eLibraryUSA",
        "Workshop de\nAcesso ao\neLibraryUSA",
        "eLibraryUSA Access Workshop",
        "Data a confirmar",
        # Safer wording — 10,000+ NOT confirmed
        "Milhares de livros,\naudiolivros e recursos",
        "⚑ PENDENTE: data e acesso\na confirmar pelo coordenador",
        True,
    ),
]


# ── Utilities ─────────────────────────────────────────────────────────────────

def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def make_qr(url: str, size: int) -> Image.Image:
    """Generate QR code at target size. Returns RGBA PIL image."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=NAVY, back_color=CREAM).convert("RGBA")
    return img.resize((size, size), Image.LANCZOS)


def fill_cover(path: str, w: int, h: int) -> Image.Image:
    img = Image.open(path).convert("RGB")
    iw, ih = img.size
    s = max(w / iw, h / ih)
    nw, nh = int(iw * s), int(ih * s)
    img = img.resize((nw, nh), Image.LANCZOS)
    x, y = (nw - w) // 2, (nh - h) // 2
    return img.crop((x, y, x + w, y + h))


def load_header_strip(target_w: int) -> Image.Image:
    """
    Extract the canonical header strip from poster 01 (y=0 to y=165).
    Scale to target_w maintaining aspect ratio.
    """
    poster = Image.open(POSTER_01).convert("RGB")
    header = poster.crop((0, 0, poster.width, 165))
    scale = target_w / header.width
    new_h = int(header.height * scale)
    return header.resize((target_w, new_h), Image.LANCZOS)


def vertical_scrim(
    size: tuple[int, int],
    top_alpha: int,
    bot_alpha: int,
) -> Image.Image:
    """Return a navy gradient scrim (RGBA) from top_alpha to bot_alpha."""
    w, h = size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for y in range(h):
        a = int(top_alpha + (bot_alpha - top_alpha) * y / h)
        draw.line([(0, y), (w, y)], fill=(*NAVY, a))
    return layer


def wrapped_text_height(
    text: str,
    fnt: ImageFont.FreeTypeFont,
    max_w: int,
    line_spacing: int = 8,
) -> int:
    """Return total height that draw_text will occupy."""
    dummy = Image.new("RGBA", (1, 1))
    dd = ImageDraw.Draw(dummy)
    lines = _wrap(text, fnt, max_w)
    total = 0
    for line in lines:
        bb = fnt.getbbox(line) if line else (0, 0, 0, fnt.size)
        total += (bb[3] - bb[1]) + line_spacing
    return total


def _wrap(text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    lines = []
    for para in text.split("\n"):
        words = para.split()
        if not words:
            lines.append("")
            continue
        cur = words[0]
        for w in words[1:]:
            test = cur + " " + w
            bb = fnt.getbbox(test)
            if bb[2] - bb[0] <= max_w:
                cur = test
            else:
                lines.append(cur)
                cur = w
        lines.append(cur)
    return lines


def draw_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    fnt: ImageFont.FreeTypeFont,
    x: int,
    y: int,
    max_w: int,
    fill: tuple,
    line_spacing: int = 8,
    align: str = "left",
) -> int:
    """Draw wrapped text; returns y below last line."""
    lines = _wrap(text, fnt, max_w)
    cy = y
    for line in lines:
        bb = fnt.getbbox(line) if line else (0, 0, 0, fnt.size)
        lh = bb[3] - bb[1]
        lw = bb[2] - bb[0]
        if align == "center":
            draw.text((x + (max_w - lw) // 2, cy), line, font=fnt, fill=fill)
        elif align == "right":
            draw.text((x + max_w - lw, cy), line, font=fnt, fill=fill)
        else:
            draw.text((x, cy), line, font=fnt, fill=fill)
        cy += lh + line_spacing
    return cy


def pill(
    draw: ImageDraw.ImageDraw,
    text: str,
    fnt: ImageFont.FreeTypeFont,
    x: int,
    y: int,
    bg: tuple,
    fg: tuple,
    px: int = 16,
    py: int = 8,
    r: int = 14,
) -> tuple[int, int]:
    """Draw a pill badge at (x, y) top-left. Returns (width, height)."""
    bb = fnt.getbbox(text)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    w, h = tw + px * 2, th + py * 2
    draw.rounded_rectangle([x, y, x + w, y + h], radius=r, fill=bg)
    draw.text((x + px, y + py), text, font=fnt, fill=fg)
    return w, h


def paste_qr(canvas: Image.Image, qr: Image.Image, cx: int, cy: int, pad: int = 10) -> None:
    """Paste QR with a cream backing frame, centered at (cx, cy)."""
    qw, qh = qr.size
    fw, fh = qw + pad * 2, qh + pad * 2
    frame = Image.new("RGBA", (fw, fh), (*CREAM, 255))
    frame.paste(qr, (pad, pad))
    canvas.paste(frame.convert("RGB"), (cx - fw // 2, cy - fh // 2))


def accent_bar(draw, x0, y, x1, h=5):
    draw.rectangle([x0, y, x1, y + h], fill=RED_US)


# ── Square renderer ───────────────────────────────────────────────────────────

def render_square(slot: tuple) -> str:
    stem, bg_path, badge, pt_head, en_sub, date_pt, body_pt, note, is_pending = slot
    W, H = SQ
    M = 48  # side margin

    # 1. Background photo
    base = fill_cover(bg_path, W, H)
    base = ImageEnhance.Color(base).enhance(0.80)
    base = ImageEnhance.Brightness(base).enhance(0.65)
    canvas = base.convert("RGBA")

    # 2. Gradient scrim (heavier for squares so text always reads)
    canvas = Image.alpha_composite(canvas, vertical_scrim((W, H), 100, 240))

    # 3. Paste header strip at top
    header = load_header_strip(W)
    hdr_h = header.height   # ~169 px
    canvas.paste(header, (0, 0))

    # 4. Red accent stripe below header
    draw = ImageDraw.Draw(canvas)
    accent_bar(draw, 0, hdr_h, W, h=6)

    # ── Content area starts at hdr_h + 6 ──────────────────────────────────
    CONTENT_TOP = hdr_h + 6
    # Bottom band: navy strip with QR + CTA
    QR_SZ       = 196
    BAND_H      = QR_SZ + 50   # ~246
    BAND_Y      = H - BAND_H

    # Available vertical space for text
    TEXT_W    = W - 2 * M
    text_y    = CONTENT_TOP + 18

    f_badge  = font(FONT_BOLD, 26)
    f_date   = font(FONT_BOLD, 32)
    f_head   = font(FONT_BOLD, 72)
    f_sub    = font(FONT_REG,  30)
    f_body   = font(FONT_REG,  32)
    f_note   = font(FONT_BOLD, 22)
    f_cta    = font(FONT_REG,  29)

    # Badge pill (left-aligned)
    pill_w, pill_h = pill(draw, badge, f_badge, M, text_y,
                          bg=RED_US, fg=WHITE, px=14, py=8, r=12)
    text_y += pill_h + 14

    # Date
    text_y = draw_text(draw, date_pt, f_date, M, text_y, TEXT_W, GOLD_LT, line_spacing=4)
    text_y += 8

    # Gold divider
    accent_bar(draw, M, text_y, M + 60, h=4)
    text_y += 12

    # Portuguese headline (large)
    text_y = draw_text(draw, pt_head, f_head, M, text_y, TEXT_W, WHITE, line_spacing=8)
    text_y += 10

    # English subtitle (smaller, gold, optional — omit if space tight)
    space_left = BAND_Y - text_y - 10
    if space_left > 50:
        text_y = draw_text(draw, en_sub, f_sub, M, text_y, TEXT_W, GOLD, line_spacing=4)
        text_y += 8

    # Body text
    if body_pt:
        space_left = BAND_Y - text_y - 10
        if space_left > 48:
            draw_text(draw, body_pt, f_body, M, text_y, TEXT_W, GOLD_LT, line_spacing=5)

    # Pending note (if eLibraryUSA)
    if note:
        note_h = wrapped_text_height(note, f_note, TEXT_W)
        note_y = BAND_Y - note_h - 10
        if note_y > text_y:
            draw_text(draw, note, f_note, M, note_y, TEXT_W, GOLD, line_spacing=4)

    # 5. Bottom band
    draw.rectangle([0, BAND_Y, W, H], fill=(*NAVY, 248))
    accent_bar(draw, 0, BAND_Y, W, h=5)

    # QR (right side of band)
    qr = make_qr(REG_URL, QR_SZ)
    QR_CX = W - M - QR_SZ // 2 - 6
    QR_CY = BAND_Y + BAND_H // 2
    paste_qr(canvas, qr, QR_CX, QR_CY, pad=10)

    # CTA text (left side of band)
    draw = ImageDraw.Draw(canvas)
    cta_max_w = QR_CX - QR_SZ // 2 - M - 16
    cta_y = BAND_Y + 22
    draw_text(draw, CTA_ON_IMAGE, f_cta, M, cta_y, cta_max_w, WHITE, line_spacing=7)

    out = os.path.join(OUT_DIR, f"{stem}_square.png")
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(f"  ✓ {os.path.basename(out)}")
    return out


# ── Story renderer ────────────────────────────────────────────────────────────

def render_story(slot: tuple) -> str:
    stem, bg_path, badge, pt_head, en_sub, date_pt, body_pt, note, is_pending = slot
    W, H = STORY
    M = 60  # side margin

    # 1. Background photo
    base = fill_cover(bg_path, W, H)
    base = ImageEnhance.Color(base).enhance(0.80)
    base = ImageEnhance.Brightness(base).enhance(0.65)
    canvas = base.convert("RGBA")

    # 2. Gradient scrim: light at top, heavy in lower 65%
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scrim)
    for y in range(H):
        if y < H * 0.35:
            a = int(50 + 90 * y / (H * 0.35))
        else:
            t = (y - H * 0.35) / (H * 0.65)
            a = int(140 + 95 * t)
        sd.line([(0, y), (W, y)], fill=(*NAVY, min(a, 235)))
    canvas = Image.alpha_composite(canvas, scrim)

    # 3. Header strip at top
    header = load_header_strip(W)
    hdr_h = header.height
    canvas.paste(header, (0, 0))

    draw = ImageDraw.Draw(canvas)

    # 4. Red accent stripe below header
    accent_bar(draw, 0, hdr_h, W, h=6)

    SAFE_BOT    = 130    # bottom safe zone for phone UI
    QR_SZ       = 240
    QR_FRAME_PAD = 14
    # Absolute QR position: frame bottom at H - SAFE_BOT - 20
    QR_FRAME_BOT = H - SAFE_BOT - 20
    QR_CY       = QR_FRAME_BOT - (QR_SZ // 2 + QR_FRAME_PAD)
    QR_FRAME_TOP = QR_CY - (QR_SZ // 2 + QR_FRAME_PAD)

    CONTENT_TOP = hdr_h + 6
    TEXT_W      = W - 2 * M

    f_badge  = font(FONT_BOLD, 32)
    f_date   = font(FONT_BOLD, 40)
    f_head   = font(FONT_BOLD, 88)
    f_sub    = font(FONT_REG,  36)
    f_body   = font(FONT_REG,  38)
    f_note   = font(FONT_BOLD, 28)
    f_cta    = font(FONT_REG,  34)

    # Reserve bottom: QR frame + CTA text above it (no overlap)
    cta_h   = wrapped_text_height(CTA_ON_IMAGE, f_cta, TEXT_W, line_spacing=7)
    CTA_BOT = QR_FRAME_TOP - 20          # CTA ends 20px above QR frame
    CTA_TOP = CTA_BOT - cta_h           # CTA starts here
    # Content area stops before CTA
    CONTENT_BOT = CTA_TOP - 24

    text_y = CONTENT_TOP + 24

    # Badge pill
    pill_w, pill_h = pill(draw, badge, f_badge, M, text_y,
                          bg=RED_US, fg=WHITE, px=16, py=10, r=14)
    text_y += pill_h + 18

    # Date
    text_y = draw_text(draw, date_pt, f_date, M, text_y, TEXT_W, GOLD_LT, line_spacing=5)
    text_y += 10

    # Gold accent bar
    accent_bar(draw, M, text_y, M + 80, h=5)
    text_y += 18

    # Portuguese headline (large)
    text_y = draw_text(draw, pt_head, f_head, M, text_y, TEXT_W, WHITE, line_spacing=10)
    text_y += 12

    # English subtitle
    if text_y + 40 < CONTENT_BOT - 80:
        text_y = draw_text(draw, en_sub, f_sub, M, text_y, TEXT_W, GOLD, line_spacing=5)
        text_y += 10

    # Body text
    if body_pt and text_y + 50 < CONTENT_BOT - 40:
        accent_bar(draw, M, text_y, M + 60, h=4)
        text_y += 12
        draw_text(draw, body_pt, f_body, M, text_y, TEXT_W, GOLD_LT, line_spacing=7)

    # Pending note pinned just above CTA
    if note:
        note_h = wrapped_text_height(note, f_note, TEXT_W, line_spacing=5)
        note_y = CTA_TOP - note_h - 16
        if note_y > text_y:
            draw_text(draw, note, f_note, M, note_y, TEXT_W, GOLD, line_spacing=5)

    # 5. CTA text (non-overlapping above QR)
    draw_text(draw, CTA_ON_IMAGE, f_cta, M, CTA_TOP, TEXT_W, WHITE, line_spacing=7, align="center")

    # 6. QR code centered
    qr = make_qr(REG_URL, QR_SZ)
    QR_CX = W // 2
    paste_qr(canvas, qr, QR_CX, QR_CY, pad=QR_FRAME_PAD)

    out = os.path.join(OUT_DIR, f"{stem}_story.png")
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(f"  ✓ {os.path.basename(out)}")
    return out


# ── Contact sheet ─────────────────────────────────────────────────────────────

def make_contact_sheet(files: list[str]) -> str:
    COLS   = 6
    THUMB  = 340
    TH_SQ  = 340
    TH_ST  = 605
    PAD    = 14
    LBL_H  = 32
    HDR_H  = 56

    squares = sorted(p for p in files if p.endswith("_square.png"))
    stories  = sorted(p for p in files if p.endswith("_story.png"))

    sheet_w = COLS * THUMB + (COLS + 1) * PAD
    sheet_h = HDR_H + PAD + (TH_SQ + LBL_H + PAD) + (TH_ST + LBL_H + PAD) + PAD

    sheet = Image.new("RGB", (sheet_w, sheet_h), NAVY)
    draw  = ImageDraw.Draw(sheet)

    hdr_f   = font(FONT_BOLD, 26)
    label_f = font(FONT_REG,  20)
    draw.text((PAD, PAD + 4),
              "American Space Mindelo / UniCV — America250 Social Cuts",
              font=hdr_f, fill=GOLD)
    draw.text((PAD, PAD + 34),
              "12 assets: 6 square (1080×1080) + 6 story (1080×1920)  |  QR = registration form (confirmed URL)",
              font=label_f, fill=CREAM)

    def paste_row(imgs, y0, th):
        for i, p in enumerate(imgs):
            try:
                img = Image.open(p)
                img.thumbnail((THUMB, th), Image.LANCZOS)
                tw, tth = img.size
                x = PAD + i * (THUMB + PAD) + (THUMB - tw) // 2
                y = y0 + (th - tth) // 2
                sheet.paste(img, (x, y))
                name = os.path.basename(p).replace(".png", "")
                lx = PAD + i * (THUMB + PAD)
                draw.text((lx, y0 + th + 3), name, font=label_f, fill=GOLD)
            except Exception as e:
                print(f"  ! contact thumb error {p}: {e}")

    ROW0_Y = HDR_H + PAD * 2
    ROW1_Y = ROW0_Y + TH_SQ + LBL_H + PAD * 2

    paste_row(squares, ROW0_Y, TH_SQ)
    paste_row(stories,  ROW1_Y, TH_ST)

    out = os.path.join(OUT_DIR, "00_contact_sheet.png")
    sheet.save(out, "PNG")
    print(f"  ✓ {os.path.basename(out)}")
    return out


# ── ZIP package ───────────────────────────────────────────────────────────────

def make_zip(files: list[str]) -> str:
    z = os.path.join(OUT_DIR, "mindelo_america250_social_cuts.zip")
    with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in files:
            zf.write(p, os.path.basename(p))
    print(f"  ✓ {os.path.basename(z)}")
    return z


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    print("=== American Space Mindelo / America250 Social Cuts Generator ===\n")

    # Verify required source assets
    required = [
        (POSTER_01,      "poster 01 (header source)"),
        (IMG_COMPOSITE,  "mindelo-composite.jpg"),
        (IMG_BANNER,     "mindelo-banner.jpg"),
        (IMG_SPACES,     "american-spaces.jpg"),
    ]
    for path, label in required:
        if not os.path.exists(path):
            print(f"STOP: Missing source asset: {label}\n  → {path}")
            sys.exit(1)
    print("All source assets verified.\n")

    # Pre-extract and verify header strip
    hdr = load_header_strip(1080)
    print(f"Header strip extracted from poster 01: {hdr.size}\n")

    all_files = []

    print("Rendering social cuts...")
    for slot in SLOTS:
        stem = slot[0]
        print(f"\n  [{stem}]")
        sq = render_square(slot)
        st = render_story(slot)
        all_files.extend([sq, st])

    print("\nBuilding contact sheet...")
    contact = make_contact_sheet(all_files)

    print("\nPackaging ZIP...")
    z = make_zip(all_files + [contact])

    print(f"\nAll done.")
    print(f"Output: {OUT_DIR}/")
    print(f"  12 PNGs + 1 contact sheet + 1 ZIP")
    print(f"  ZIP: {os.path.basename(z)}")


if __name__ == "__main__":
    main()
