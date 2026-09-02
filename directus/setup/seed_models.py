#!/usr/bin/env python3
"""Seed a demo model subdomain site from existing shared content.

Creates a single model (subdomain ``model1`` so it resolves on localhost)
that reuses shared galleries and an existing image as the main photo, and
links the placeholder videos. Idempotent by subdomain. This is demo data to
exercise the model site UI; real models are managed in Directus.

Env: DIRECTUS_URL (default http://localhost:8055), ADMIN_EMAIL, ADMIN_PASSWORD
"""
import os
import json
import urllib.request

BASE = os.environ.get("DIRECTUS_URL", "http://localhost:8055").rstrip("/")
EMAIL = os.environ["ADMIN_EMAIL"]
PASSWORD = os.environ["ADMIN_PASSWORD"]
SUBDOMAIN = os.environ.get("MODEL_SUBDOMAIN", "model1")


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
        print("HTTP %s on %s %s" % (e.code, method, url), file=__import__("sys").stderr)
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


def main():
    import urllib.parse
    tok = login()

    existing = req("GET", "/items/models?filter[subdomain][_eq]=" + urllib.parse.quote(SUBDOMAIN) + "&limit=1", tok)
    if existing["data"]:
        print("model '%s' already exists, skipping" % SUBDOMAIN)
        return

    # Reuse an existing gallery's cover as the model's main photo (avoids a
    # directus_files read that the admin policy gates behind a field filter).
    galleries = req("GET", "/items/galleries?limit=3&fields=id,slug,cover.id", tok)["data"]
    photo_id = galleries[0]["cover"]["id"] if galleries and galleries[0].get("cover") else None

    videos = req("GET", "/items/videos?limit=5&fields=id", tok)["data"]

    model = {
        "subdomain": SUBDOMAIN,
        "name": "Демо-модель",
        "description": (
            "Привет! Я демонстрационная модель на платформе Kira Sekira.\n\n"
            "Здесь будут ваши параметры, биография и альбомы с фотосессиями. "
            "Всё управляется из админки — ничего не захардкожено в коде."
        ),
        "bust": 90,
        "waist": 60,
        "hips": 90,
        "clothing_size": 42,
        "height": 175,
        "weight": 55,
        "shoe_size": 38,
        "hair_color": "русые",
        "eye_color": "карие",
    }
    if photo_id:
        model["main_photo"] = photo_id

    mid = req("POST", "/items/models", tok, model)["data"]["id"]
    print("created model", mid)

    for i, g in enumerate(galleries):
        req("POST", "/items/models_galleries", tok, {"models_id": mid, "galleries_id": g["id"], "sort": i + 1})
    print("linked %d galleries" % len(galleries))

    for i, v in enumerate(videos):
        req("POST", "/items/models_videos", tok, {"models_id": mid, "videos_id": v["id"], "sort": i + 1})
    print("linked %d videos" % len(videos))

    print("DONE demo model seeded")


if __name__ == "__main__":
    main()
