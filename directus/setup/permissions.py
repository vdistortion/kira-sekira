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
    "reviews",
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
    admin_role_id = next((a["role"] for a in access if a["role"] is not None), None)
    admin_policy = next((a["policy"] for a in access if a["role"] == admin_role_id), None)

    # The bootstrapped admin may lack the `admin: true` flag, so it is subject to
    # field-level permissions. Promote it to a real super-admin so the seed scripts
    # (and any admin token) get full access and bypass field restrictions.
    if admin_role_id:
        try:
            api("PATCH", f"/roles/{admin_role_id}", tok, {"admin": True})
            print(f"OK: role {admin_role_id} set as super-admin")
        except Exception as e:
            print("warn: could not set admin flag:", e, file=sys.stderr)

    admin_perms = [
        {**empty_perm(), "action": a, "collection": "*",
         "fields": ["*", "sort"] if a == "read" else ["*"]}
        for a in ("read", "create", "update", "delete")
    ]
    # System collections (e.g. directus_files) are NOT covered by `collection: "*"`
    # and must be granted explicitly, otherwise admin read/upload of files 403s.
    for c in ("directus_files", "directus_folders"):
        for a in ("read", "create", "update"):
            admin_perms.append({**empty_perm(), "action": a, "collection": c, "fields": ["*"]})

    public_fields = {c: ["*"] for c in PUBLIC_READ}
    # `sort` is the manual-order field and is NOT covered by `*`, so allow it
    # explicitly. `reviews.author` also needs to be named explicitly.
    for c in ("reviews", "prices"):
        public_fields[c] = ["*", "sort"]
    public_fields["reviews"] = ["*", "sort", "author"]
    public_perms = [
        {**empty_perm(), "action": "read", "collection": c, "fields": f}
        for c, f in public_fields.items()
    ]

    api("PATCH", f"/policies/{admin_policy}", tok, {"permissions": admin_perms})
    api("PATCH", f"/policies/{public_policy}", tok, {"permissions": public_perms})
    print(f"OK: admin policy {admin_policy} (full), public policy {public_policy} (read on {len(PUBLIC_READ)} collections)")

    # Make the Directus admin UI default to Russian
    try:
        api("PATCH", "/settings", tok, {"default_language": "ru-RU"})
        print("OK: default admin language set to ru-RU")
    except Exception as e:
        print("warn: could not set default language:", e, file=sys.stderr)


if __name__ == "__main__":
    main()
