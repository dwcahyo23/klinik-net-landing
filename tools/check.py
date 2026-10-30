#!/usr/bin/env python3
"""Cek statis halaman: tautan & aset lokal harus ada, dasar HTML lengkap.

Jalankan: python tools/check.py   (exit 0 = semua OK)
Tanpa dependensi — HTMLParser + os.path cukup untuk situs statis.
Struktur tag sengaja tidak divalidasi ketat: void tag SVG (<path/>, <circle/>)
membuat pelacakan buka/tutup tag berisik dan tidak layak dirawat di sini.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = ("http://", "https://", "mailto:", "tel:", "//", "data:", "#")

errors = []

for name in sorted(f for f in os.listdir(ROOT) if f.endswith(".html")):
    page = os.path.join(ROOT, name)
    src = open(page, encoding="utf-8").read()

    if "<title>" not in src:
        errors.append(f"{name}: tanpa <title>")
    if 'charset="utf-8"' not in src.lower().replace("'", '"'):
        errors.append(f"{name}: tanpa <meta charset>")
    if not re.search(r'<html[^>]+lang=', src):
        errors.append(f"{name}: <html> tanpa lang")
    if not src.rstrip().endswith("</html>"):
        errors.append(f"{name}: tidak ditutup </html>")
    for img in re.findall(r"<img\b[^>]*>", src):
        if "alt=" not in img:
            errors.append(f"{name}: <img> tanpa alt: {img[:60]}...")

    for href in set(re.findall(r'(?:href|src)="([^"]+)"', src)):
        if href.startswith(SKIP):
            continue
        target = href.split("#")[0]
        if not target:
            continue
        base = ROOT if target.startswith("/") else os.path.dirname(page)
        if not os.path.exists(os.path.normpath(os.path.join(base, target.lstrip("/")))):
            errors.append(f"{name}: '{href}' tidak ada di disk")

for rel in ("assets/css/style.css", "assets/js/main.js"):
    p = os.path.join(ROOT, rel)
    if not os.path.exists(p) or os.path.getsize(p) == 0:
        errors.append(f"{rel}: hilang atau kosong")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print("OK: semua halaman valid (title, charset, lang, alt, tautan & aset lokal ada)")
