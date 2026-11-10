# /// script
# dependencies = [
#     "markdown>=3.5.0",
# ]
# ///
"""
Markdown to PDF Converter for Saba Lembang Documentation
---------------------------------------------------------
Converts Markdown documents into publication-grade PDFs using
high-fidelity HTML styling and Headless Google Chrome.

Usage:
    uv run scripts/md_to_pdf.py docs/PANDUAN_SIMULASI_MIDTRANS.md
"""

from __future__ import annotations
import re
import subprocess
import sys
import tempfile
from pathlib import Path
import markdown


HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
  @page {{
    size: A4 portrait;
    margin: 11mm 15mm 11mm 15mm;
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.45;
    font-size: 8.8pt;
    margin: 0;
    padding: 0;
  }}

  /* Header Branding */
  .doc-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #047857;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }}

  .brand {{
    display: flex;
    align-items: center;
    gap: 8px;
  }}

  .brand-logo-text {{
    font-family: 'Playfair Display', serif;
    font-size: 14pt;
    font-weight: 700;
    color: #064e3b;
    letter-spacing: -0.02em;
  }}

  .brand-sub {{
    font-size: 7pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #059669;
  }}

  .badge-sandbox {{
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background-color: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
    padding: 3px 8px;
    border-radius: 9999px;
    font-size: 7.5pt;
    font-weight: 700;
  }}

  .badge-dot {{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #10b981;
    display: inline-block;
  }}

  /* Headings */
  h1 {{
    font-family: 'Playfair Display', serif;
    font-size: 15pt;
    color: #064e3b;
    margin-top: 0;
    margin-bottom: 3px;
    line-height: 1.25;
  }}

  .lead {{
    color: #475569;
    font-size: 8.5pt;
    margin-bottom: 8px;
    line-height: 1.4;
  }}

  h3 {{
    font-size: 9.8pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 8px;
    margin-bottom: 4px;
    padding-bottom: 2px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 6px;
  }}

  h3::before {{
    content: "";
    display: inline-block;
    width: 4px;
    height: 12px;
    background: #059669;
    border-radius: 2px;
  }}

  hr {{
    border: 0;
    height: 1px;
    background: #e2e8f0;
    margin: 6px 0;
  }}

  p {{
    margin-top: 0;
    margin-bottom: 4px;
  }}

  /* Lists and Steps */
  ol, ul {{
    margin-top: 2px;
    margin-bottom: 5px;
    padding-left: 17px;
  }}

  li {{
    margin-bottom: 3px;
    line-height: 1.4;
  }}

  li strong {{
    color: #0f172a;
  }}

  /* Code & Badges */
  code {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    background-color: #f1f5f9;
    color: #0f766e;
    padding: 1px 4px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    font-weight: 600;
  }}

  /* Links & Callouts */
  a {{
    color: #047857;
    text-decoration: none;
    font-weight: 600;
    border-bottom: 1px dashed #059669;
    word-break: break-all;
  }}

  /* Footer Note */
  .doc-footer {{
    margin-top: 10px;
    padding-top: 5px;
    border-top: 1px solid #cbd5e1;
    display: flex;
    justify-content: space-between;
    font-size: 7pt;
    color: #64748b;
  }}
</style>
</head>
<body>

  <div class="doc-header">
    <div class="brand">
      <div>
        <div class="brand-logo-text">Saba Lembang</div>
        <div class="brand-sub">Platform Wisata & Marketplace Interdesa Kawasan Lembang</div>
      </div>
    </div>
    <div>
      <span class="badge-sandbox">
        <span class="badge-dot"></span>
        Midtrans Sandbox Testing
      </span>
    </div>
  </div>

  {content}

  <div class="doc-footer">
    <div><strong>Saba Lembang</strong> &bull; Panduan Resmi Pengujian Pembayaran Digital & Cetak E-Ticket</div>
    <div>Dokumen Pengujian Sandbox &bull; Kabupaten Bandung Barat</div>
  </div>

</body>
</html>
"""


def convert_md_to_html(md_path: Path) -> str:
    raw_text = md_path.read_text(encoding="utf-8")
    
    # Extract Title
    title_match = re.search(r"^#\s+(.+)$", raw_text, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else md_path.stem
    
    # Process Markdown
    html_body = markdown.markdown(
        raw_text,
        extensions=["extra", "sane_lists", "nl2br"]
    )
    
    # Convert first H1 into styled header + lead paragraph
    html_body = re.sub(
        r"<h1>(.*?)</h1>\s*<p>(.*?)</p>",
        r"<h1>\1</h1>\n<p class=\"lead\">\2</p>",
        html_body,
        count=1,
        flags=re.DOTALL
    )

    return HTML_TEMPLATE.format(title=title, content=html_body)


def render_pdf(html_content: str, output_pdf: Path) -> None:
    with tempfile.NamedTemporaryFile("w", suffix=".html", encoding="utf-8", delete=False) as f:
        f.write(html_content)
        temp_html = Path(f.name)

    try:
        cmd = [
            "google-chrome",
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={output_pdf.resolve()}",
            temp_html.as_uri(),
        ]
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"✅ Berhasil membuat PDF: {output_pdf.resolve()}")
    finally:
        if temp_html.exists():
            temp_html.unlink()


def main():
    if len(sys.argv) < 2:
        default_file = Path("docs/PANDUAN_SIMULASI_MIDTRANS.md")
        if default_file.exists():
            target_md = default_file
        else:
            print("Penggunaan: uv run scripts/md_to_pdf.py <file.md> [output.pdf]")
            sys.exit(1)
    else:
        target_md = Path(sys.argv[1])

    if not target_md.exists():
        print(f"Error: File tidak ditemukan: {target_md}")
        sys.exit(1)

    if len(sys.argv) >= 3:
        target_pdf = Path(sys.argv[2])
    else:
        target_pdf = target_md.with_suffix(".pdf")

    html_content = convert_md_to_html(target_md)
    render_pdf(html_content, target_pdf)


if __name__ == "__main__":
    main()
