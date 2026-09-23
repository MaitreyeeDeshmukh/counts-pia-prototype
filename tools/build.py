#!/usr/bin/env python3
"""Inline the split source into one self-contained file.

The app is written as separate files so it is readable. Some places (the
Claude artifact viewer, emailing a single file to someone) need one HTML
file with no external references, so this script inlines the CSS and JS.

    python3 tools/build.py        ->  dist/counts.html
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "index.html").read_text()

css = (ROOT / "assets/css/styles.css").read_text()
html = html.replace(
    '<link rel="stylesheet" href="assets/css/styles.css">',
    "<style>\n" + css + "</style>",
)

def inline_script(match):
    path = ROOT / match.group(1)
    return "<script>\n" + path.read_text() + "</script>"

html = re.sub(r'<script src="([^"]+)"></script>', inline_script, html)

out = ROOT / "dist" / "counts.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html)
print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size:,} bytes)")
