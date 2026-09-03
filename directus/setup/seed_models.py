#!/usr/bin/env python3
"""Seed demo model subdomain sites from existing shared content.

Creates model records for the demo subdomains ``yana`` and ``kirochka`` that
reuse shared galleries and an existing image as the main photo, and link the
placeholder videos. Idempotent by subdomain. This is demo/test data to
exercise the model site UI; real models are managed in Directus.

Env: DIRECTUS_URL (default http://localhost:8055), ADMIN_EMAIL, ADMIN_PASSWORD
"""
import os
import json
import urllib.request
import urllib.error

BASE = os.environ.get("DIRECTUS_URL", "http://localhost:8055").rstrip("/")
EMAIL = os.environ["ADMIN_EMAIL"]
PASSWORD = os.environ["ADMIN_PASSWORD"]

# Placeholder demo models mapped to the live subdomains yana/kirochka.
# All content is test data until production launch.
DEMO_MODELS = [
    {
        "subdomain": "yana",
        "name": "Яна (демо)",
        "description": (
            "Привет! Я Яна — модель на платформе Kira Sekira.\n\n"
            "Здесь мои параметры, биография и альбомы с фотосессиями. "
            "Всё управляется из админки — ничего не захардкожено в коде."
        ),
        "bust": 90, "waist": 60, "hips": 90, "clothing_size": 42,
        "height": 175, "weight": 55, "shoe_size": 38,
        "hair_color": "русые", "eye_color": "карие",
    },
    {
        "subdomain": "kirochka",
        "name": "Кира (демо)",
        "description": (
            "Привет! Я Кира — модель на платформе Kira Sekira.\n\n"
            "Мои параметры, короткая биография и собственные альбомы "
            "с фотосессиями управляются из админки Directus."
        ),
        "bust": 85, "waist": 58, "hips": 88, "clothing_size": 40,
        "height": 178, "weight": 52, "shoe_size": 39,
        "hair_color": "каштановые", "eye_color": "зелёные",
    },
]


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

    # Shared content we can reuse for demos.
    galleries = req("GET", "/items/galleries?limit=10&fields=id,slug,cover.id", tok)["data"]
    videos = req("GET", "/items/videos?limit=5&fields=id", tok)["data"]

    existing = {m["subdomain"]: m["id"] for m in req("GET", "/items/models?limit=-1&fields=id,subdomain", tok)["data"]}

    for spec in DEMO_MODELS:
        sub = spec["subdomain"]
        if sub in existing:
            print("model '%s' already exists, skipping" % sub)
            continue

        # Pick a main photo from a (different per model) gallery cover.
        idx = DEMO_MODELS.index(spec)
        photo_id = None
        if galleries:
            g = galleries[idx % len(galleries)]
            photo_id = g.get("cover", {}).get("id") if g.get("cover") else None

        payload = {k: v for k, v in spec.items() if k != "subdomain"}
        payload["subdomain"] = sub
        if photo_id:
            payload["main_photo"] = photo_id

        mid = req("POST", "/items/models", tok, payload)["data"]["id"]
        print("created model", sub, mid)

        linked_galleries = galleries[idx * 2 : idx * 2 + 3] or galleries[:3]
        for i, g in enumerate(linked_galleries):
            req("POST", "/items/models_galleries", tok, {"models_id": mid, "galleries_id": g["id"], "sort": i + 1})
        print("  linked %d galleries" % len(linked_galleries))

        for i, v in enumerate(videos):
            req("POST", "/items/models_videos", tok, {"models_id": mid, "videos_id": v["id"], "sort": i + 1})
        print("  linked %d videos" % len(videos))

    print("DONE demo models seeded")


if __name__ == "__main__":
    main()
