"""Read-only public HTML/link/image audit using the Python standard library."""
import argparse
import concurrent.futures
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = self.description = self.canonical = self.robots = ""
        self.h1 = []
        self.links, self.images, self.ids, self.schemas = [], [], [], []
        self.capture = None
        self.schema = False
        self.schema_text = ""
        self.ignore = 0
        self.words = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.append(a["id"])
        if tag == "title":
            self.capture = "title"
        if tag == "h1":
            self.h1.append("")
            self.capture = "h1"
        if tag == "meta":
            key = a.get("name", "").lower()
            if key == "description": self.description = a.get("content", "")
            if key == "robots": self.robots = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href", "")
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag == "img":
            self.images.append({"src": a.get("src", ""), "alt": a.get("alt")})
        if tag in ("script", "style"):
            self.ignore += 1
        if tag == "script" and a.get("type") == "application/ld+json":
            self.schema = True
            self.schema_text = ""

    def handle_endtag(self, tag):
        if tag in ("title", "h1"): self.capture = None
        if tag == "script" and self.schema:
            try: self.schemas.append(json.loads(self.schema_text))
            except ValueError: self.schemas.append({"_invalid": True})
            self.schema = False
        if tag in ("script", "style"): self.ignore = max(0, self.ignore - 1)

    def handle_data(self, data):
        if self.schema: self.schema_text += data
        if self.capture == "title": self.title += data
        if self.capture == "h1": self.h1[-1] += data
        if not self.ignore: self.words.append(data)


def fetch(url, image=False):
    started = time.monotonic()
    req = urllib.request.Request(url, headers={"User-Agent": "TaishGaming-Public-Audit/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=25) as response:
            body = response.read(8192 if image else 4_000_000)
            return {"url": url, "final": response.url, "status": response.status,
                    "type": response.headers.get("Content-Type", ""),
                    "xrobots": response.headers.get("X-Robots-Tag", ""),
                    "seconds": round(time.monotonic() - started, 2), "body": body}
    except urllib.error.HTTPError as error:
        return {"url": url, "status": error.code, "error": str(error)}
    except Exception as error:
        return {"url": url, "status": 0, "error": str(error)}


def run():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://www.taishgaming.com")
    parser.add_argument("--output", default="output/public-audit-2026-11-03.json")
    parser.add_argument("--max-pages", type=int, default=350)
    parser.add_argument("--canonical-origin", help="Map this site's absolute links to a local preview origin.")
    args = parser.parse_args()
    base = args.base.rstrip("/")
    host = urllib.parse.urlsplit(base).netloc
    allowed_hosts = {host}
    if args.canonical_origin:
        allowed_hosts.add(urllib.parse.urlsplit(args.canonical_origin).netloc)
    def internal(href, source=base):
        parsed = urllib.parse.urlsplit(urllib.parse.urljoin(source, href))
        if parsed.netloc not in allowed_hosts or parsed.scheme not in ("http", "https"): return None
        path = parsed.path or "/"
        if re.match(r"^/(api|admin|dashboard|auth|players)(/|$)", path): return None
        if re.search(r"\.[a-zA-Z0-9]{1,6}$", path): return None
        return base + path.rstrip("/") if path != "/" else base + "/"
    robots = fetch(base + "/robots.txt")
    sitemap = fetch(base + "/sitemap.xml")
    sitemap_urls = []
    try:
        xml = ET.fromstring(sitemap.get("body", b""))
        sitemap_urls = [x.text for x in xml.iter() if x.tag.endswith("}loc") and x.text]
    except ET.ParseError: pass
    frontier = {base + "/", *[u for s in sitemap_urls if (u := internal(s))]}
    pages, link_sources, image_sources = {}, defaultdict(set), defaultdict(set)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        while frontier and len(pages) < args.max_pages:
            batch = sorted(frontier - pages.keys())[:min(24, args.max_pages - len(pages))]
            if not batch: break
            frontier.difference_update(batch)
            for result in pool.map(fetch, batch):
                raw = result.pop("body", b"")
                if result["status"] == 200 and "text/html" in result.get("type", ""):
                    p = Page()
                    p.feed(raw.decode("utf-8", errors="replace"))
                    result.update(title=p.title.strip(), description=p.description,
                                  canonical=p.canonical, robots=p.robots, h1=p.h1,
                                  ids=p.ids, links=p.links, images=p.images,
                                  words=len(" ".join(p.words).split()),
                                  invalid_schemas=sum(bool(s.get("_invalid")) for s in p.schemas if isinstance(s, dict)))
                    for href in p.links:
                        if u := internal(href, result["url"]):
                            link_sources[u].add(result["url"])
                            if u not in pages: frontier.add(u)
                    for image in p.images:
                        if not image["src"]: continue
                        image_url = urllib.parse.urljoin(result["url"], image["src"])
                        parsed = urllib.parse.urlsplit(image_url)
                        if parsed.path == "/_next/image":
                            source = urllib.parse.parse_qs(parsed.query).get("url", [image_url])[0]
                            image_url = urllib.parse.urljoin(base, source)
                        if image_url.startswith(base + "/"):
                            image_sources[image_url].add(result["url"])
                pages[result["url"]] = result
            print(f"Audited {len(pages)} pages; {len(frontier - pages.keys())} queued", flush=True)
        images = list(pool.map(lambda u: fetch(u, True), sorted(image_sources)))
    for result in images:
        result.pop("body", None)
        result["pages"] = sorted(image_sources[result["url"]])
    broken = [{**p, "linked_from": sorted(link_sources[p["url"]])}
              for p in pages.values() if p["status"] != 200]
    duplicates = {}
    for field in ("title", "description"):
        groups = defaultdict(list)
        for p in pages.values():
            if p.get(field) and p.get("final") == p["url"] and "noindex" not in p.get("robots", ""):
                groups[p[field]].append(p["url"])
        duplicates[field] = {k: v for k, v in groups.items() if len(v) > 1}
    fragments = []
    for page in pages.values():
        for href in page.get("links", []):
            target = urllib.parse.urlsplit(urllib.parse.urljoin(page["url"], href))
            fragment = urllib.parse.unquote(target.fragment)
            destination = internal(href, page["url"])
            if fragment and destination in pages and pages[destination].get("status") == 200 and fragment not in pages[destination].get("ids", []):
                fragments.append({"from": page["url"], "href": href, "fragment": fragment})
    report = {"base": base, "sitemap_urls": sitemap_urls, "broken_fragments_to_review": fragments,
              "robots": robots.get("body", b"").decode(errors="replace"),
              "summary": {"pages": len(pages), "page_statuses": dict(Counter(p["status"] for p in pages.values())),
                          "images": len(images), "broken_images": sum(r["status"] != 200 or not r.get("type", "").startswith("image/") for r in images),
                          "frontier_remaining": len(frontier - pages.keys())},
              "broken_links": broken, "duplicates": duplicates,
              "pages": list(pages.values()), "images": images}
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report["summary"]), flush=True)
    print(f"Saved {output}", flush=True)


if __name__ == "__main__": run()
