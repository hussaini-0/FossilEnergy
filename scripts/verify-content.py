"""Check source-page coverage and every local link/media target in the static export.

Run after `npm run build`:  python scripts/verify-content.py
Requires: beautifulsoup4 (pip install beautifulsoup4)
"""
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import sys

from bs4 import BeautifulSoup

VARIANTS = ["3d", "2d"]

root = Path(__file__).resolve().parents[1]
out = root / "out"
if not (out / "index.html").exists():
    sys.exit("No export found. Run `npm run build` first.")

# Tracked list of the original website's pages (from the 19 Nov 2026 source audit).
source_pages = json.loads((root / "data/sourcePages.json").read_text(encoding="utf-8"))

missing, broken, count = [], set(), 0
_ids = {}


def ids_in(path: Path) -> set:
    if path not in _ids:
        soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
        _ids[path] = {el.get("id") for el in soup.select("[id]")}
    return _ids[path]

for row in source_pages:
    for v in VARIANTS:
        count += 1
        if not (out / v / (row["slug"] + ".html")).exists():
            missing.append(f"{v}/{row['slug']}")

html_files = list(out.rglob("*.html"))
for file in html_files:
    soup = BeautifulSoup(file.read_text(encoding="utf-8"), "html.parser")
    for el in soup.select("a[href], img[src]"):
        url = el.get("href") or el.get("src")
        p = urlparse(url)
        if p.scheme or p.netloc or not p.path.startswith("/"):
            continue
        path = unquote(p.path)
        target = out / path.lstrip("/")
        if path == "/":
            target = out / "index.html"
        elif not target.suffix:
            target = Path(str(target) + ".html")
        if not target.exists():
            broken.add(f"{path}  (linked from {file.relative_to(out)})")
        elif p.fragment and target.suffix == ".html" and p.fragment not in ids_in(target):
            broken.add(f"{path}#{p.fragment}  (anchor missing; linked from {file.relative_to(out)})")
    # In-page anchors (#stations etc.) must exist on the target page.
    ids = ids_in(file)
    for el in soup.select('a[href^="#"]'):
        frag = el["href"][1:]
        if frag and frag not in ids:
            broken.add(f"#{frag}  (missing anchor in {file.relative_to(out)})")

media = json.loads((root / "data/sourceMedia.json").read_text(encoding="utf-8"))
docs = {a["local"] for p in media.values() for a in p["documents"] if not a.get("downloadError")}

print(json.dumps({
    "html_pages_checked": len(html_files),
    "original_page_variant_routes_checked": count,
    "missing_source_routes": missing,
    "broken_local_targets": sorted(broken),
    "original_documents": len(docs),
    "local_media_files": len(list((root / "public/source-media").iterdir())),
}, indent=2))
if missing or broken:
    sys.exit(1)
print("OK")
