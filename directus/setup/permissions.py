#!/usr/bin/env python3
"""Apply Directus access policies so the site works end-to-end.

Run after `schema apply` (or any time). Idempotent: it (re)sets the
Administrator policy to full access and grants the Public policy read
access to every collection the frontend reads without a token, including
the m2m junction tables and directus_files (for asset URLs).

Env:
  DIRECTUS_URL   (default http://localhost:8055)
  ADMIN_EMAIL / ADMIN_PASSWORD  (the bootstrapped admin)
"""
import os
import sys
import time
import json
import urllib.request
import urllib.error

BASE = os.environ.get("DIRECTUS_URL", "http://localhost:8055").rstrip("/")
EMAIL = os.environ.get("ADMIN_EMAIL")
PASSWORD = os.environ.get("ADMIN_PASSWORD")

if not EMAIL or not PASSWORD:
    print("ADMIN_EMAIL / ADMIN_PASSWORD must be set", file=sys.stderr)
    sys.exit(1)

PUBLIC_READ = [
    "main_site",
    "contacts",
    "prices",
    "videos",
    "models",
    "galleries",
    "gallery_images",
    "directus_files",
    # m2m junction tables must be readable too, or relation expansion returns null
    "main_site_videos",
    "models_videos",
    "main_site_galleries",
    "models_galleries",
]


def api(method, path, token=None, body=None):
    url = BASE + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read().decode()
        return json.loads(raw) if raw else None


def login():
    last = None
    for _ in range(40):
        try:
            return api("POST", "/auth/login",
                       body={"email": EMAIL, "password": PASSWORD})["data"]["access_token"]
        except Exception as e:  # studio still booting
            last = e
            time.sleep(2)
    print("admin login failed:", last, file=sys.stderr)
    sys.exit(1)


def empty_perm():
    return {"permissions": {}, "validation": None, "presets": None, "limit": None}


def main():
    tok = login()

    access = api("GET", "/access?fields=id,role,policy", tok)["data"]
    public_policy = next(a["policy"] for a in access if a["role"] is None)
    roles = api("GET", "/roles?fields=id,name", tok)["data"]
    admin_role = next((r["id"] for r in roles if r["name"] == "Administrator"), None)
    if admin_role:
        admin_policy = next(a["policy"] for a in access if a["role"] == admin_role)
    else:
        admin_policy = next(a["policy"] for a in access if a["role"] is not None)

    admin_perms = [
        {**empty_perm(), "action": a, "collection": "*", "fields": ["*"]}
        for a in ("read", "create", "update", "delete")
    ]
    public_perms = [
        {**empty_perm(), "action": "read", "collection": c, "fields": ["*"]}
        for c in PUBLIC_READ
    ]

    api("PATCH", f"/policies/{admin_policy}", tok, {"permissions": admin_perms})
    api("PATCH", f"/policies/{public_policy}", tok, {"permissions": public_perms})
    print(f"OK: admin policy {admin_policy} (full), public policy {public_policy} (read on {len(PUBLIC_READ)} collections)")


if __name__ == "__main__":
    main()
