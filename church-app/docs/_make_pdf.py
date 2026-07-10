"""Génère des PDF bien structurés à partir des docs Markdown du projet.
Usage: python docs/_make_pdf.py
"""
import re
from datetime import date
from pathlib import Path

import markdown
from fpdf import FPDF
from fpdf.fonts import FontFace, TextStyle
from fpdf.enums import XPos, YPos

DOCS_DIR = Path(__file__).parent
FONTS_DIR = Path("C:/Windows/Fonts")
NOIR = (0, 0, 0)
GRIS = (90, 90, 90)
GRIS_CLAIR = (160, 160, 160)

DOCUMENTS = [
    {
        "src": "PROJECT.md",
        "out": "PROJECT.pdf",
        "title": "Church App",
        "subtitle": "Documentation du projet",
    },
    {
        "src": "BACKEND.md",
        "out": "BACKEND.pdf",
        "title": "Church App",
        "subtitle": "Documentation backend (Supabase)",
    },
]


def make_cover(pdf: FPDF, title: str, subtitle: str):
    pdf.set_auto_page_break(False)
    pdf.add_page()

    pdf.set_y(pdf.h / 2 - 30)
    pdf.set_text_color(*NOIR)
    pdf.set_font("calibri", "B", 22)
    pdf.cell(0, 12, title, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font("calibri", "", 13)
    pdf.set_text_color(*GRIS)
    pdf.cell(0, 9, subtitle, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_y(pdf.h - 25)
    pdf.set_font("calibri", "", 10)
    pdf.set_text_color(*GRIS_CLAIR)
    pdf.cell(0, 8, f"Centre International des Vainqueurs — {date.today():%d/%m/%Y}", align="C")
    pdf.set_auto_page_break(True, margin=18)


def md_to_pdf(src_path: Path, out_path: Path, title: str, subtitle: str):
    text = src_path.read_text(encoding="utf-8")
    html = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists", "toc"],
    )
    # fpdf2's HTML renderer ne supporte pas de balises imbriquées (<code>, <a>...)
    # à l'intérieur de <td>/<th> ; on les retire en ne gardant que le texte.
    def _clean_cell(match: re.Match) -> str:
        inner = re.sub(r"<a[^>]*>(.*?)</a>", r"\1", match.group(2), flags=re.DOTALL)
        inner = re.sub(r"</?(strong|b|em|i)>", "", inner)
        return match.group(1) + inner + match.group(3)

    html = re.sub(r"(<t[dh][^>]*>)(.*?)(</t[dh]>)", _clean_cell, html, flags=re.DOTALL)
    # Hors tableau, le <pre> englobant garde son style monospace sans <code>.
    html = re.sub(r"</?code>", "", html)

    pdf = FPDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(18, 18, 18)

    pdf.add_font("calibri", "", str(FONTS_DIR / "calibri.ttf"))
    pdf.add_font("calibri", "B", str(FONTS_DIR / "calibrib.ttf"))
    pdf.add_font("calibri", "I", str(FONTS_DIR / "calibrii.ttf"))
    pdf.add_font("calibri", "BI", str(FONTS_DIR / "calibriz.ttf"))
    pdf.add_font("consolas", "", str(FONTS_DIR / "consola.ttf"))
    pdf.add_font("consolas", "B", str(FONTS_DIR / "consolab.ttf"))

    make_cover(pdf, title, subtitle)
    pdf.add_page()
    pdf.set_text_color(*NOIR)

    tag_styles = {
        "h1": TextStyle(font_family="calibri", color=NOIR, font_size_pt=16, font_style="B", t_margin=4, b_margin=2),
        "h2": TextStyle(font_family="calibri", color=NOIR, font_size_pt=13, font_style="B", t_margin=3, b_margin=1.5),
        "h3": TextStyle(font_family="calibri", color=NOIR, font_size_pt=11.5, font_style="B", t_margin=2.5, b_margin=1),
        "p": TextStyle(font_family="calibri", color=NOIR, font_size_pt=11),
        "li": TextStyle(font_family="calibri", color=NOIR, font_size_pt=11, l_margin=6),
        "pre": TextStyle(font_family="consolas", color=NOIR, font_size_pt=9.5, t_margin=2, b_margin=2),
        "blockquote": TextStyle(font_family="calibri", color=GRIS, font_size_pt=11, font_style="I", t_margin=2, b_margin=2),
        "code": FontFace(family="consolas", color=NOIR),
        "strong": FontFace(family="calibri", emphasis="BOLD"),
        "a": FontFace(family="calibri", color=NOIR, emphasis="UNDERLINE"),
    }

    pdf.write_html(
        html,
        tag_styles=tag_styles,
        table_line_separators=True,
        li_prefix_color=NOIR,
        font_family="calibri",
    )

    # Numérotation des pages (sauf la couverture)
    pdf.alias_nb_pages()

    pdf.output(str(out_path))
    print(f"OK -> {out_path}")


def main():
    for doc in DOCUMENTS:
        md_to_pdf(DOCS_DIR / doc["src"], DOCS_DIR / doc["out"], doc["title"], doc["subtitle"])


if __name__ == "__main__":
    main()
