#!/usr/bin/env python3
"""Seed core singleton/lookup content into Directus from the site copy.

Populates main_site text fields, the contacts singleton and the two price
packages. Idempotent: singletons are PATCHed, prices are upserted by name.

Env: DIRECTUS_URL (default http://localhost:8055), ADMIN_EMAIL, ADMIN_PASSWORD
"""
import os
import json
import urllib.request
import urllib.error

BASE = os.environ.get("DIRECTUS_URL", "http://localhost:8055").rstrip("/")
EMAIL = os.environ["ADMIN_EMAIL"]
PASSWORD = os.environ["ADMIN_PASSWORD"]


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
            import time
            time.sleep(2)
    print("login failed", file=__import__("sys").stderr)
    __import__("sys").exit(1)


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

    prices = [
        ("Стандарт", 5000,
         "1 часовая съёмка, 2 образа, все кадры (30+) в цветокоррекции, детальная ретушь 12 фото, "
         "обработка 1-2 недели. Доп. ретушь — 300р/фото, срочность (2 дня) — 2000р. Студия оплачивается клиентом."),
        ("Премиум", 7000,
         "2 часовая съёмка, 4 образа, все кадры (60+) в цветокоррекции, детальная ретушь 25 фото, "
         "обработка 1-2 недели. Возможен видеоролик +1500р. Доп. ретушь — 300р/фото, срочность (2 дня) — 2000р. "
         "Студия оплачивается клиентом."),
    ]
    for name, price, desc in prices:
        existing = req("GET", "/items/prices?filter[name][_eq]=" + urllib.parse.quote(name) + "&limit=1", tok)
        if existing["data"]:
            req("PATCH", f"/items/prices/{existing['data'][0]['id']}", tok, {"price": price, "description": desc})
        else:
            req("POST", "/items/prices", tok, {"name": name, "price": price, "description": desc})
        print(f"price '{name}' updated")

    print("DONE core content seeded")


if __name__ == "__main__":
    main()
