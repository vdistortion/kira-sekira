#!/usr/bin/env python3
"""Seed demo galleries (albums) and placeholder media into Directus.

Downloads real placeholder photographs from picsum.photos, uploads them as
Directus files (stored in the configured storage, e.g. R2), then builds a few
galleries (cover + images), links them to the main site and the demo models,
and sets hero/main photos + price covers. Idempotent by slug/title.

Env: DIRECTUS_URL (default http://localhost:8055), ADMIN_EMAIL, ADMIN_PASSWORD
"""
import os
import sys
import json
import time
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
    print("  download failed after retries:", last, file=sys.stderr)
    raise last


def upload_placeholder(seed, title, tok):
    try:
        data = fetch_bytes("https://picsum.photos/seed/%s/900/1200" % seed)
    except Exception as e:
        print("  placeholder download failed for %s: %s" % (seed, e), file=__import__("sys").stderr)
        return None
    body = b""
    body += b"--" + BOUND + b"\r\n"
    body += b'Content-Disposition: form-data; name="file"; filename="' + seed.encode() + b'.jpg"\r\n'
    body += b"Content-Type: image/jpeg\r\n\r\n" + data + b"\r\n"
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
    _mark_public(data, tok)
    return data


def _mark_public(f, tok):
    if not f or not f.get("id"):
        return
    try:
        if not f.get("public"):
            req("PATCH", "/items/files/" + f["id"], tok, {"public": True})
    except Exception as e:
        print("  could not mark %s public: %s" % (f.get("title"), e), file=sys.stderr)


def ensure_file(seed, title, tok):
    existing = req("GET", "/files?filter[title][_eq]=" + urllib.parse.quote(title) + "&limit=1", tok)
    if existing and existing.get("data"):
        f = existing["data"][0]
        _mark_public(f, tok)
        return f
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
        if existing and existing.get("data"):
            print("gallery '%s' exists, skipping" % g["slug"])
            created.append(existing["data"][0])
            continue
        cover = ensure_file(g["slug"] + "-cover", g["title"] + " (обложка)", tok)
        payload = {"slug": g["slug"], "title": g["title"]}
        if cover:
            payload["cover"] = cover["id"]
        gid = req("POST", "/items/galleries", tok, payload)["data"]["id"]
        print("created gallery", g["slug"], gid)
        for i in range(1, 4):
            img = ensure_file("%s-%d" % (g["slug"], i), "%s %d" % (g["title"], i), tok)
            if not img:
                continue
            req("POST", "/items/gallery_images", tok, {"galleries_id": gid, "image": img["id"], "sort": i})
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

    print("DONE demo galleries/media seeded")


if __name__ == "__main__":
    main()
