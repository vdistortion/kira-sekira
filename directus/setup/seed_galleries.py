#!/usr/bin/env python3
"""Seed demo galleries (albums) and placeholder media into Directus.

Generates gradient placeholder images on the fly (pure stdlib PNG, no binaries
in the repo, no external download) and uploads them as Directus files (stored
in the configured storage, e.g. R2). Falls back to picsum.photos if reachable.
Then builds a few galleries (cover + images), links them to the main site and
the demo models, and sets hero/main photos + price covers. Idempotent by slug/title.

Env: DIRECTUS_URL (default http://localhost:8055), ADMIN_EMAIL, ADMIN_PASSWORD
"""
import os
import sys
import json
import time
import math
import zlib
import struct
import urllib.request
import urllib.error
import urllib.parse

BASE = os.environ.get("DIRECTUS_URL", "http://localhost:8055").rstrip("/")
EMAIL = os.environ["ADMIN_EMAIL"]
PASSWORD = os.environ["ADMIN_PASSWORD"]
BOUND = b"opencodeboundary12345"


def req(method, path, token=None, body=None, public_fallback=True):
    url = BASE + path
    data = json.dumps(body).encode() if body is not None else None

    def _do(tok):
        r = urllib.request.Request(url, data=data, method=method)
        r.add_header("Content-Type", "application/json")
        if tok:
            r.add_header("Authorization", "Bearer " + tok)
        with urllib.request.urlopen(r, timeout=30) as resp:
            raw = resp.read().decode()
            return json.loads(raw) if raw else None

    for _ in range(3):
        try:
            return _do(token)
        except urllib.error.HTTPError as e:
            # Reads that the admin token is not permitted to perform can fall back
            # to the public policy (reviews/files are publicly readable for demo).
            if public_fallback and method == "GET" and token and e.code == 403:
                print("  (read denied for admin, retrying without token)", file=sys.stderr)
                try:
                    return _do(None)
                except urllib.error.HTTPError:
                    pass
                raise
            detail = ""
            try:
                detail = e.read().decode()
            except Exception:
                pass
            if e.code == 429:
                time.sleep(5)
                continue
            print("HTTP %s %s %s: %s" % (e.code, method, url, detail), file=sys.stderr)
            raise


def login():
    for _ in range(40):
        try:
            return req("POST", "/auth/login",
                       body={"email": EMAIL, "password": PASSWORD})["data"]["access_token"]
        except Exception:
            time.sleep(2)
    print("login failed", file=__import__("sys").stderr)
    __import__("sys").exit(1)


def _png(w, h, rows):
    raw = b"".join(b"\x00" + row for row in rows)
    comp = zlib.compress(raw, 9)

    def chunk(t, d):
        c = t + d
        return struct.pack(">I", len(d)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", comp) + chunk(b"IEND", b"")


def make_placeholder(seed):
    """Generate a colored gradient PNG placeholder without external deps."""
    w, h = 900, 1200
    hue = float(abs(hash(seed))) % 6.2831853
    rows = []
    for y in range(h):
        row = bytearray()
        for x in range(w):
            t = x / w * 0.6 + y / h * 0.4
            r = 140 + 100 * math.sin(t * 6.283 + hue)
            g = 140 + 100 * math.sin(t * 6.283 + hue + 2.094)
            b = 140 + 100 * math.sin(t * 6.283 + hue + 4.188)
            row += bytes((max(0, min(255, int(r))), max(0, min(255, int(g))), max(0, min(255, int(b)))))
        rows.append(bytes(row))
    return _png(w, h, rows)


def fetch_bytes(url):
    last = None
    for _ in range(4):
        try:
            r = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(r, timeout=60) as resp:
                return resp.read()
        except Exception as e:
            last = e
            time.sleep(3)
    print("  picsum unavailable:", last, file=sys.stderr)
    raise last


def upload_placeholder(seed, title, tok):
    data = None
    if seed.isascii():
        try:
            data = fetch_bytes("https://picsum.photos/seed/%s/900/1200" % urllib.parse.quote(seed))
        except Exception:
            data = None
    if not data:
        data = make_placeholder(seed)
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        ext, ctype = ".png", "image/png"
    else:
        ext, ctype = ".jpg", "image/jpeg"
    body = b""
    body += b"--" + BOUND + b"\r\n"
    body += b'Content-Disposition: form-data; name="file"; filename="' + seed.encode() + ext.encode() + b'"\r\n'
    body += b"Content-Type: " + ctype.encode() + b"\r\n\r\n" + data + b"\r\n"
    body += b"--" + BOUND + b"\r\n"
    body += b'Content-Disposition: form-data; name="title"\r\n\r\n' + title.encode() + b"\r\n"
    body += b"--" + BOUND + b"--\r\n"
    r = urllib.request.Request(BASE + "/files", data=body, method="POST")
    r.add_header("Content-Type", "multipart/form-data; boundary=" + BOUND.decode())
    r.add_header("Authorization", "Bearer " + tok)
    try:
        with urllib.request.urlopen(r, timeout=120) as resp:
            data = json.loads(resp.read().decode())["data"]
    except Exception as e:
        print("  upload failed for %s: %s" % (seed, e), file=sys.stderr)
        return None
    return data


def ensure_file(seed, title, tok):
    existing = req("GET", "/files?filter[title][_eq]=" + urllib.parse.quote(title) + "&limit=1", tok)
    if existing and existing.get("data"):
        return existing["data"][0]
    return upload_placeholder(seed, title, tok)


def main():
    tok = login()

    GALLERIES = [
        {"slug": "business", "title": "Деловой стиль"},
        {"slug": "evening", "title": "Вечерний образ"},
        {"slug": "studio", "title": "Студийная съёмка"},
        {"slug": "casual", "title": "Повседневный образ"},
    ]

    created = []
    for g in GALLERIES:
        existing = req("GET", "/items/galleries?filter[slug][_eq]=" + urllib.parse.quote(g["slug"]) + "&limit=1", tok)
        current = (existing or {}).get("data") or []
        if current:
            gid = current[0]["id"]
            print("gallery '%s' exists" % g["slug"])
        else:
            cover = ensure_file(g["slug"] + "-cover", g["title"] + " (обложка)", tok)
            payload = {"slug": g["slug"], "title": g["title"]}
            if cover:
                payload["cover"] = cover["id"]
            gid = req("POST", "/items/galleries", tok, payload)["data"]["id"]
            print("created gallery", g["slug"], gid)

        # Attach the 3 images unless the gallery already has some (idempotent, and
        # repairs galleries that were seeded before the field name was corrected).
        count = req("GET", "/items/gallery_images?filter[gallery][_eq]=%s&limit=1&fields=id" % gid, tok)
        if not ((count or {}).get("data") or []):
            for i in range(1, 4):
                img = ensure_file("%s-%d" % (g["slug"], i), "%s %d" % (g["title"], i), tok)
                if not img:
                    continue
                req("POST", "/items/gallery_images", tok, {"gallery": gid, "image": img["id"], "sort": i})
            print("  attached images to gallery", g["slug"])
        created.append({"id": gid})

    # Link galleries to the main site
    ms = req("GET", "/items/main_site", tok)["data"]
    msid = ms["id"]
    for i, g in enumerate(created):
        link = req("GET", "/items/main_site_galleries?filter[main_site_id][_eq]=%s&filter[galleries_id][_eq]=%s&limit=1" % (msid, g["id"]), tok)
        if not (link and link.get("data")):
            req("POST", "/items/main_site_galleries", tok, {"main_site_id": msid, "galleries_id": g["id"], "sort": i + 1})
    print("linked %d galleries to main site" % len(created))

    # Hero/main photo for the main site
    hero = ensure_file("main-hero", "Главное фото (демо)", tok)
    if hero and not ms.get("main_photo"):
        req("PATCH", "/items/main_site", tok, {"main_photo": hero["id"]})

    # Main photo for each demo model
    for sub in ("yana", "kirochka"):
        m = req("GET", "/items/models?filter[subdomain][_eq]=" + urllib.parse.quote(sub) + "&limit=1", tok)
        if not (m and m.get("data")):
            continue
        mid = m["data"][0]["id"]
        if m["data"][0].get("main_photo"):
            continue
        ph = ensure_file(sub + "-hero", "Фото %s (демо)" % sub, tok)
        if ph:
            req("PATCH", "/items/models/" + mid, tok, {"main_photo": ph["id"]})

    # Price covers (overrides seed_core skip when local images are absent)
    for name in ("Стандарт", "Премиум"):
        p = req("GET", "/items/prices?filter[name][_eq]=" + urllib.parse.quote(name) + "&limit=1", tok)
        if not (p and p.get("data")):
            continue
        pid = p["data"][0]["id"]
        if p["data"][0].get("image"):
            continue
        img = ensure_file("price-" + name, "Цена %s (демо)" % name, tok)
        if img:
            req("PATCH", "/items/prices/" + pid, tok, {"image": img["id"]})

    # Summary: how many real gallery images ended up linked
    gi = req("GET", "/items/gallery_images?limit=-1&fields=id", tok).get("data") or []
    files = req("GET", "/files?limit=-1&fields=id", tok).get("data") or []
    print("SUMMARY: %d files, %d gallery_images linked" % (len(files), len(gi)))
    print("DONE demo galleries/media seeded")


if __name__ == "__main__":
    main()
