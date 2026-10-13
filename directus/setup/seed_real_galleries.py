#!/usr/bin/env python3
"""Seed the five selected main-site galleries from the local image directory.

Reads only the five explicitly listed folders directly under IMAGES_ROOT,
uploads their images, creates/updates gallery covers, and links the galleries
to main_site. Idempotent: skips files/galleries that already exist.

Env:
  DIRECTUS_URL   — default http://localhost:8055
  ADMIN_EMAIL    — required
  ADMIN_PASSWORD — required
  IMAGES_ROOT    — default /home/v/Desktop/garage_images/kira-sekira
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
IMAGES_ROOT = os.environ.get(
    "IMAGES_ROOT", "/home/v/Desktop/garage_images/kira-sekira"
)
GALLERIES = [
    ("ДЕНЬ РОЖДЕНИЯ В BODEGA", "ДЕНЬ РОЖДЕНИЯ В BODEGA"),
    ("КОРПОРАТИВ BEAVER GROUP 2024", "КОРПОРАТИВ BEAVER GROUP 2024"),
    (
        "КОРПОРАТИВ _SMART_ НА ТЕПЛОХОДЕ 2025",
        "КОРПОРАТИВ «SMART» НА ТЕПЛОХОДЕ 2025",
    ),
    (
        "МОРСКОЙ КРУИЗ YACHTFIT ЧЕРНОГОРИЯ",
        "МОРСКОЙ КРУИЗ YACHTFIT ЧЕРНОГОРИЯ",
    ),
    (
        "ФЕСТИВАЛЬ _АЛЛА. ВЕСНА. ЛЮБОВЬ_ 2026 ",
        "ФЕСТИВАЛЬ «АЛЛА. ВЕСНА. ЛЮБОВЬ» 2026",
    ),
]
BOUND = b"opencodeboundary12345"

MIME = {
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".avif": "image/avif",
}

TRANSLIT = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d",
    "е": "e", "ё": "yo", "ж": "zh", "з": "z", "и": "i",
    "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
    "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
    "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch",
    "ш": "sh", "щ": "shch", "ъ": "", "ы": "y", "ь": "",
    "э": "e", "ю": "yu", "я": "ya",
}


def slugify(name: str) -> str:
    result = []
    for ch in name.lower():
        if ch in TRANSLIT:
            result.append(TRANSLIT[ch])
        elif ch.isascii() and (ch.isalnum() or ch == "-"):
            result.append(ch)
        elif ch in " _":
            result.append("-")
    slug = "".join(result).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug


def req(method, path, token=None, body=None):
    url = BASE + path
    data = json.dumps(body).encode() if body is not None else None
    for attempt in range(3):
        try:
            r = urllib.request.Request(url, data=data, method=method)
            r.add_header("Content-Type", "application/json")
            if token:
                r.add_header("Authorization", "Bearer " + token)
            with urllib.request.urlopen(r, timeout=60) as resp:
                raw = resp.read().decode()
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
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
    raise RuntimeError("request failed after retries: %s %s" % (method, path))


def login() -> str:
    for _ in range(40):
        try:
            return req(
                "POST", "/auth/login",
                body={"email": EMAIL, "password": PASSWORD},
            )["data"]["access_token"]
        except Exception:
            time.sleep(2)
    print("login failed", file=sys.stderr)
    sys.exit(1)


def upload_file(path: str, title: str, tok: str):
    ext = os.path.splitext(path)[1].lower()
    mime = MIME.get(ext, "application/octet-stream")
    disk_name = os.path.basename(path)
    with open(path, "rb") as f:
        data = f.read()
    crlf = b"\r\n"
    body = b""
    body += b"--" + BOUND + crlf
    body += (
        b'Content-Disposition: form-data; name="file"; filename="'
        + disk_name.encode()
        + b'"'
        + crlf
    )
    body += b"Content-Type: " + mime.encode() + crlf + crlf + data + crlf
    body += b"--" + BOUND + crlf
    body += (
        b'Content-Disposition: form-data; name="title"'
        + crlf
        + crlf
        + title.encode()
        + crlf
    )
    body += b"--" + BOUND + b"--" + crlf
    r = urllib.request.Request(BASE + "/files", data=body, method="POST")
    r.add_header("Content-Type", "multipart/form-data; boundary=" + BOUND.decode())
    r.add_header("Authorization", "Bearer " + tok)
    with urllib.request.urlopen(r, timeout=180) as resp:
        return json.loads(resp.read().decode())["data"]


def find_file_by_title(title: str, tok: str):
    res = req(
        "GET",
        "/files?filter[title][_eq]=" + urllib.parse.quote(title) + "&limit=1",
        tok,
    )
    items = (res or {}).get("data") or []
    return items[0] if items else None


def ensure_file(path: str, title: str, tok: str):
    existing = find_file_by_title(title, tok)
    if existing:
        return existing
    return upload_file(path, title, tok)


def main():
    if not os.path.isdir(IMAGES_ROOT):
        print("images directory not found: %s" % IMAGES_ROOT, file=sys.stderr)
        sys.exit(1)
    missing = [folder for folder, _ in GALLERIES
               if not os.path.isdir(os.path.join(IMAGES_ROOT, folder))]
    if missing:
        print("gallery folders not found: %s" % ", ".join(missing), file=sys.stderr)
        sys.exit(1)

    tok = login()
    print("Галерей выбрано: %d" % len(GALLERIES))

    created_gallery_ids = []

    for folder_name, title in GALLERIES:
        slug = slugify(title)
        folder_path = os.path.join(IMAGES_ROOT, folder_name)

        image_files = sorted(
            f for f in os.listdir(folder_path)
            if os.path.splitext(f)[1].lower() in MIME
        )
        if not image_files:
            print("  пропускаю %s — нет изображений" % folder_name)
            continue

        # Найти или создать галерею
        existing = req(
            "GET",
            "/items/galleries?filter[slug][_eq]=" + urllib.parse.quote(slug) + "&limit=1",
            tok,
        )
        current = (existing or {}).get("data") or []

        if current:
            gid = current[0]["id"]
            if current[0].get("title") != title:
                req("PATCH", "/items/galleries/" + str(gid), tok, {"title": title})
                print("обновлено название галереи: %s" % title)
            else:
                print("галерея '%s' уже существует (id=%s)" % (title, gid))
        else:
            # Первое изображение — обложка
            cover_path = os.path.join(folder_path, image_files[0])
            cover_title = "%s — обложка" % title
            print("  загружаю обложку: %s" % image_files[0])
            cover = ensure_file(cover_path, cover_title, tok)

            payload = {"slug": slug, "title": title}
            if cover:
                payload["cover"] = cover["id"]
            gid = req("POST", "/items/galleries", tok, payload)["data"]["id"]
            print("создана галерея '%s' (id=%s, slug=%s)" % (title, gid, slug))

        # Привязать изображения, если ещё не привязаны
        count_res = req(
            "GET",
            "/items/gallery_images?filter[gallery][_eq]=%s&limit=1&fields=id" % gid,
            tok,
        )
        already_has_images = bool(((count_res or {}).get("data") or []))

        if already_has_images:
            print("  изображения уже привязаны, пропускаю")
        else:
            for sort_idx, fname in enumerate(image_files, start=1):
                img_path = os.path.join(folder_path, fname)
                img_title = "%s / %s" % (title, os.path.splitext(fname)[0])
                print("  [%d/%d] %s" % (sort_idx, len(image_files), fname))
                img = ensure_file(img_path, img_title, tok)
                if not img:
                    continue
                req(
                    "POST", "/items/gallery_images", tok,
                    {"gallery": gid, "image": img["id"], "sort": sort_idx},
                )
            print("  привязано %d изображений" % len(image_files))

        created_gallery_ids.append(gid)

    # Привязать галереи к main_site
    ms = req("GET", "/items/main_site", tok)["data"]
    msid = ms["id"]
    for gid in created_gallery_ids:
        linked = req(
            "GET",
            "/items/main_site_galleries?filter[main_site_id][_eq]=%s&filter[galleries_id][_eq]=%s&limit=1"
            % (msid, gid),
            tok,
        )
        if not ((linked or {}).get("data") or []):
            req(
                "POST", "/items/main_site_galleries", tok,
                {"main_site_id": msid, "galleries_id": gid},
            )
    print("привязано %d галерей к main_site" % len(created_gallery_ids))

    # Итог
    gi = req("GET", "/items/gallery_images?limit=-1&fields=id", tok).get("data") or []
    files = req("GET", "/files?limit=-1&fields=id", tok).get("data") or []
    print(
        "\nИТОГ: %d файлов, %d gallery_images в базе" % (len(files), len(gi))
    )
    print("DONE")


if __name__ == "__main__":
    main()
