#!/usr/bin/env python3
"""Seed Directus from the old Kira Sekira site.

Reads the old project manifest (src/projects/structure.json) and the image
library (/home/v/Pictures/kira-images/projects/<gallery>/<file>) and:

  * creates a gallery per top-level folder (slug transliterated, title = name)
  * uploads every image to Directus and links it via gallery_images
  * sets the gallery cover (a file named like "main.*", else the first one)
  * links all galleries to the main_site and sets its main_photo (about.jpg)

Idempotent: a JSON cache at $SEED_CACHE (default /tmp/opencode/seed_cache.json)
maps (gallery_slug, filename) -> Directus file id, and existing rows are
skipped. Re-running continues where it left off.

Env:
  DIRECTUS_URL       (default http://localhost:8055)
  ADMIN_EMAIL / ADMIN_PASSWORD
  STRUCTURE_JSON     (path to structure.json)
  IMAGES_ROOT        (path to kira-images root)
  MAX_PER_GALLERY    (optional cap, for testing)
"""
import os
import re
import sys
import json
import time
import urllib.request
import urllib.error

BASE = os.environ.get("DIRECTUS_URL", "http://localhost:8055").rstrip("/")
EMAIL = os.environ["ADMIN_EMAIL"]
PASSWORD = os.environ["ADMIN_PASSWORD"]
STRUCTURE = os.environ.get(
    "STRUCTURE_JSON",
    "/home/v/Projects/kira-old/src/projects/structure.json",
)
IMAGES_ROOT = os.environ.get("IMAGES_ROOT", "/home/v/Pictures/kira-images")
MAX_PER_GALLERY = int(os.environ.get("MAX_PER_GALLERY", "0")) or None
CACHE_PATH = os.environ.get("SEED_CACHE", "/tmp/opencode/seed_cache.json")
BOUND = b"opencodeboundary12345"

RU = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
}


def slugify(name):
    s = name.lower().strip()
    out = ""
    for ch in s:
        if ch in RU:
            out += RU[ch]
        elif ch == ' ':
            out += '-'
        elif ch in '-_/':
            out += ch
        elif ch.isalnum():
            out += ch
        else:
            out += '-'
    return re.sub(r'-+', '-', out).strip('-')


def safe_name(slug, fname):
    base = re.sub(r'[^A-Za-z0-9._-]', '_', fname)
    return f"{slug}__{base}"


def req(method, path, token=None, body=None):
    url = BASE + path
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("Content-Type", "application/json")
    if token:
        r.add_header("Authorization", "Bearer " + token)
    with urllib.request.urlopen(r, timeout=30) as resp:
        raw = resp.read().decode()
        return json.loads(raw) if raw else None


def login():
    for _ in range(40):
        try:
            return req("POST", "/auth/login",
                        body={"email": EMAIL, "password": PASSWORD})["data"]["access_token"]
        except Exception:
            time.sleep(2)
    print("login failed", file=sys.stderr)
    sys.exit(1)


def file_exists(fid, tok):
    try:
        req("GET", f"/files/{fid}", tok)
        return True
    except urllib.error.HTTPError:
        return False


def upload_file(path, title, disk_name, tok):
    with open(path, "rb") as f:
        data = f.read()
    crlf = b"\r\n"
    body = b""
    body += b"--" + BOUND + crlf
    body += b'Content-Disposition: form-data; name="file"; filename="' + disk_name.encode() + b'"' + crlf
    body += b"Content-Type: application/octet-stream" + crlf + crlf + data + crlf
    body += b"--" + BOUND + crlf
    body += b'Content-Disposition: form-data; name="title"' + crlf + crlf + title.encode() + crlf
    body += b"--" + BOUND + b"--" + crlf
    r = urllib.request.Request(BASE + "/files", data=body, method="POST")
    r.add_header("Content-Type", "multipart/form-data; boundary=" + BOUND.decode())
    r.add_header("Authorization", "Bearer " + tok)
    with urllib.request.urlopen(r, timeout=120) as resp:
        return json.loads(resp.read().decode())["data"]


def find_or_create_gallery(slug, title, tok):
    existing = req("GET", "/items/galleries?filter[slug][_eq]=" + urllib.parse.quote(slug) + "&limit=1", tok)
    if existing["data"]:
        return existing["data"][0]["id"]
    return req("POST", "/items/galleries", tok, {"slug": slug, "title": title})["data"]["id"]


def ensure_gallery_image(gid, fid, sort, tok):
    existing = req("GET", f"/items/gallery_images?filter[gallery][_eq]={gid}&filter[image][_eq]={fid}&limit=1", tok)
    if existing["data"]:
        return
    req("POST", "/items/gallery_images", tok, {"gallery": gid, "image": fid, "sort": sort})


def main():
    import urllib.parse
    tok = login()
    cache = {}
    if os.path.exists(CACHE_PATH):
        cache = json.load(open(CACHE_PATH))
    total = 0

    with open(STRUCTURE) as f:
        galleries = json.load(f)

    gallery_ids = []
    for g in galleries:
        name = g["name"]
        slug = slugify(name)
        folder = os.path.join(IMAGES_ROOT, "projects", name)
        print(f"[gallery] {name} -> {slug}", flush=True)
        gid = find_or_create_gallery(slug, name, tok)
        gallery_ids.append(gid)

        children = g.get("children", [])
        if MAX_PER_GALLERY:
            children = children[:MAX_PER_GALLERY]

        cover_id = None
        for idx, child in enumerate(children):
            fname = child["name"]
            src = os.path.join(folder, fname)
            if not os.path.exists(src):
                continue
            key = f"{slug}|{fname}"
            fid = cache.get(key)
            if not (fid and file_exists(fid, tok)):
                fdata = upload_file(src, fname, safe_name(slug, fname), tok)
                fid = fdata["id"]
                cache[key] = fid
                total += 1
                if total % 10 == 0:
                    json.dump(cache, open(CACHE_PATH, "w"))
                    print(f"  uploaded {total} files...", flush=True)
            ensure_gallery_image(gid, fid, idx + 1, tok)
            if cover_id is None and fname.lower().startswith("main"):
                cover_id = fid

        if cover_id is None and children:
            first = children[0]["name"]
            cover_id = cache.get(f"{slug}|{first}")
        if cover_id:
            req("PATCH", f"/items/galleries/{gid}", tok, {"cover": cover_id})
        print(f"  linked {len(children)} images", flush=True)

    json.dump(cache, open(CACHE_PATH, "w"))

    # main_photo = about.jpg
    about = os.path.join(IMAGES_ROOT, "about.jpg")
    main_photo_id = None
    if os.path.exists(about):
        main_photo_id = upload_file(about, "about", "main_site__about.jpg", tok)["id"]

    # Ensure the main_site singleton row exists so it gets a real (non-null) PK;
    # an m2m junction pointing at a null PK cannot be expanded on read.
    ms = req("GET", "/items/main_site", tok)["data"]
    if not ms or ms.get("id") is None:
        ms = req("PATCH", "/items/main_site", tok, {"site_name": "Kira Sekira"})["data"]
    msid = ms["id"]
    # Clear existing gallery links, then relink cleanly.
    rows = req("GET", "/items/main_site_galleries?limit=-1&fields=id", tok)["data"]
    for r in rows:
        req("DELETE", f"/items/main_site_galleries/{r['id']}", tok)
    for i, gid in enumerate(gallery_ids):
        req("POST", "/items/main_site_galleries", tok,
            {"main_site_id": msid, "galleries_id": gid, "sort": i + 1})
    patch = {}
    if main_photo_id:
        patch["main_photo"] = main_photo_id
    if patch:
        req("PATCH", "/items/main_site", tok, patch)

    print(f"DONE. Uploaded {total} new files; linked {len(gallery_ids)} galleries.")


if __name__ == "__main__":
    main()
