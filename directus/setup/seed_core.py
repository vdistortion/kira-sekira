#!/usr/bin/env python3
"""Seed core singleton/lookup content into Directus from the site copy.

Populates main_site text fields, the contacts singleton, the two price
packages (with their cover images) and a couple of placeholder videos linked
to the main site. Idempotent: singletons are PATCHed, prices upserted by name,
price images and videos are skipped when already present.

Env: DIRECTUS_URL (default http://localhost:8055), ADMIN_EMAIL, ADMIN_PASSWORD
"""
import os
import sys
import json
import urllib.request
import urllib.error

BASE = os.environ.get("DIRECTUS_URL", "http://localhost:8055").rstrip("/")
EMAIL = os.environ["ADMIN_EMAIL"]
PASSWORD = os.environ["ADMIN_PASSWORD"]
IMAGES_ROOT = os.environ.get("IMAGES_ROOT", "/home/v/Pictures/kira-images")
BOUND = b"opencodeboundary12345"


def req(method, path, token=None, body=None):
    url = BASE + path
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("Content-Type", "application/json")
    if token:
        r.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            raw = resp.read().decode()
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode()
        except Exception:
            pass
        print("HTTP %s %s %s: %s" % (e.code, method, url, detail), file=sys.stderr)
        raise


def login():
    for _ in range(40):
        try:
            return req("POST", "/auth/login",
                        body={"email": EMAIL, "password": PASSWORD})["data"]["access_token"]
        except Exception:
            import time
            time.sleep(2)
    print("login failed", file=__import__("sys").stderr)
    __import__("sys").exit(1)


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


def main():
    import urllib.parse
    tok = login()

    req("PATCH", "/items/main_site", tok, {
        "tagline": "Специалист визуального искусства",
        "experience_since": 2016,
        "advantages_md": (
            "- Твой проводник в мир космической фотографии\n"
            "- Раскрываю твой внутренний стержень\n"
            "- Создаю тонкую грань между тобой и искусством"
        ),
    })
    print("main_site text updated")

    cbody = {
        "phone": "+7 (910) 476-90-29",
        "telegram": "https://t.me/kirasekira",
        "whatsapp": "https://wa.me/79104769029",
        "email": "hello@kira-sekira.ru",
        "working_hours": "Пн - Сб 10:00-20:00",
    }
    req("PATCH", "/items/contacts", tok, cbody)
    print("contacts updated")

    # Prices + their cover images
    price_images = {
        "Стандарт": "prices-standart.jpg",
        "Премиум": "prices-premium.jpg",
    }
    for name, price, desc in [
        ("Стандарт", 5000,
         "1 часовая съёмка, 2 образа, все кадры в цветокоррекции (30+), детальная ретушь 12 фото, "
         "обработка 1-2 недели. Доп. ретушь — 300р/фото, срочность (2 дня) — 2000р. Студия оплачивается клиентом."),
        ("Премиум", 7000,
         "2 часовая съёмка, 4 образа, все кадры (60+) в цветокоррекции, детальная ретушь 25 фото, "
         "обработка 1-2 недели. Возможен видеоролик +1500р. Доп. ретушь — 300р/фото, срочность (2 дня) — 2000р. "
         "Студия оплачивается клиентом."),
    ]:
        existing = req("GET", "/items/prices?filter[name][_eq]=" + urllib.parse.quote(name) + "&limit=1", tok)
        if existing["data"]:
            pid = existing["data"][0]["id"]
            req("PATCH", f"/items/prices/{pid}", tok, {"price": price, "description": desc})
        else:
            pid = req("POST", "/items/prices", tok, {"name": name, "price": price, "description": desc})["data"]["id"]

        img_file = price_images.get(name)
        if img_file:
            src = os.path.join(IMAGES_ROOT, img_file)
            if os.path.exists(src):
                fname = "price__" + img_file
                existing_file = req("GET", "/items/prices/" + pid, tok)
                if not (existing_file.get("data", {}).get("image")):
                    fdata = upload_file(src, name, fname, tok)
                    req("PATCH", f"/items/prices/{pid}", tok, {"image": fdata["id"]})
                    print(f"price '{name}' image uploaded")
                else:
                    print(f"price '{name}' image already set")
        print(f"price '{name}' updated")

    # Placeholder videos linked to the main site
    ms = req("GET", "/items/main_site", tok)["data"]
    msid = ms["id"]
    videos = [
        ("Showreel", "https://www.youtube.com/watch?v=ScMzIvxBSi4"),
        ("Behind the scenes", "https://youtu.be/aqz-KE-bpKQ"),
    ]
    for i, (title, url) in enumerate(videos):
        existing = req("GET", "/items/videos?filter[title][_eq]=" + urllib.parse.quote(title) + "&limit=1", tok)
        if existing["data"]:
            vid = existing["data"][0]["id"]
        else:
            vid = req("POST", "/items/videos", tok, {"title": title, "url": url})["data"]["id"]
        linked = req("GET", f"/items/main_site_videos?filter[main_site_id][_eq]={msid}&filter[videos_id][_eq]={vid}&limit=1", tok)
        if not linked["data"]:
            req("POST", "/items/main_site_videos", tok, {"main_site_id": msid, "videos_id": vid, "sort": i + 1})
        print(f"video '{title}' linked")

    # Demo reviews (placeholder content — edit in admin)
    for i, (author, text) in enumerate([
        ("Анна", "Спасибо за потрясающую фотосессию! Чувствовала себя уверенно, результат превзошёл все ожидания."),
        ("Мария", "Профессиональный подход и очень уютная атмосфера. Фото получились живыми и красивыми."),
    ]):
        existing = req("GET", "/items/reviews?filter[author][_eq]=" + urllib.parse.quote(author) + "&limit=1", tok)
        if not existing["data"]:
            req("POST", "/items/reviews", tok, {"author": author, "text": text, "sort": i + 1})
            print(f"review '{author}' seeded")
        else:
            print(f"review '{author}' exists")

    print("DONE core content seeded")


if __name__ == "__main__":
    main()
