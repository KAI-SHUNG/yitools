#!/usr/bin/env python3
"""Scrape 爻辞 for all 64 hexagrams from cantian.ai"""

import json, re, html, time
from urllib.request import urlopen, Request
from xml.etree import ElementTree

SITEMAP_URL = "https://www.cantian.ai/wiki/zh-Hans/sitemap.xml"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; yitools-scraper/1.0)"}
YAO_KEYS = ["初", "二", "三", "四", "五", "上"]

def fetch(url: str) -> str:
    req = Request(url, headers=HEADERS)
    with urlopen(req, timeout=15) as resp:
        return resp.read().decode("utf-8")

def get_hexagram_urls() -> list[tuple[str, str]]:
    xml = fetch(SITEMAP_URL)
    root = ElementTree.fromstring(xml)
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []
    for loc in root.findall(".//s:loc", ns):
        url = loc.text.strip()
        m = re.match(r"https://www\.cantian\.ai/wiki/zh-Hans/iching/([a-z-]+)/?$", url)
        if m and m.group(1) not in ("iching_intro", "liuyao"):
            urls.append((m.group(1), url))
    return urls

def extract_yaoci(page: str) -> list[str]:
    """Extract 6 爻辞. HTML pattern: <strong>初九：</strong> 潜龙，勿用。</p>"""
    # Match: <strong>yao_name：</strong> yao_ci。</p>
    pattern = r'<strong>((?:初|上)[九六]|九[二三四五六]|六[二三四五六])：</strong>\s*([^<]+?)</p>'
    matches = re.findall(pattern, page)

    results = {}
    for name, text in matches:
        text = html.unescape(text.strip().rstrip('。，；'))
        if name not in results and len(text) >= 2:
            results[name] = text

    # Map to ordered list: 初, 二, 三, 四, 五, 上
    # Key names are like 初六/初九, 九二/六二, ..., 上六/上九
    yaoci = []
    for pos in YAO_KEYS:
        found = None
        for key in results:
            if pos in key:  # "二" in "九二", "初" in "初六", etc.
                found = results[key]
                break
        yaoci.append(found or "")
    return yaoci

def main():
    print("Fetching hexagram URLs from sitemap...")
    urls = get_hexagram_urls()
    print(f"Found {len(urls)} hexagrams\n")

    all_data = {}
    for i, (slug, url) in enumerate(urls):
        print(f"[{i+1}/{len(urls)}] {slug}...", end=" ", flush=True)
        try:
            page = fetch(url)
            yaoci = extract_yaoci(page)
            all_data[slug] = yaoci
            ok = sum(1 for y in yaoci if y)
            print(f"({ok}/6) {' | '.join(y for y in yaoci if y)[:80]}")
        except Exception as e:
            print(f"ERROR: {e}")
            all_data[slug] = [""] * 6
        time.sleep(0.3)

    out_path = "/home/z/yitools/scripts/yaoci_data.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    total = sum(1 for v in all_data.values() for y in v if y)
    print(f"\nSaved {len(all_data)} hexagrams, {total}/384 爻辞 extracted -> {out_path}")

if __name__ == "__main__":
    main()
