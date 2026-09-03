#!/usr/bin/env python3
"""Apply Directus access policies so the site works end-to-end.

Run after `schema apply` (or any time). Idempotent: it (re)sets the
Administrator policy to full access and grants the Public policy read
access to every collection the frontend reads without a token, including
the m2m junction tables and directus_files (for asset URLs).

Directus stores permissions as rows in `directus_permissions` linked to a
policy. PATCHing a policy's `permissions` relation does not reliably
replace the rows, so we delete and re-create them explicitly.

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
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read().decode()
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode()
        except Exception:
            pass
        print("HTTP %s %s: %s" % (e.code, path, detail), file=sys.stderr)
        raise


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


def set_permissions(policy_id, perms, tok):
    """Replace all permission rows for a policy with the given list."""
    existing = api("GET", f"/permissions?filter[policy][_eq]={policy_id}&fields=id", tok)["data"]
    for p in existing:
        try:
            api("DELETE", f"/permissions/{p['id']}", tok)
        except Exception as e:
            print("warn: could not delete permission", p.get("id"), e, file=sys.stderr)
    for perm in perms:
        body = dict(perm)
        body["policy"] = policy_id
        api("POST", "/permissions", tok, body)


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

    # Public reads are what the frontend depends on, so apply them first.
    set_permissions(public_policy, public_perms, tok)
    try:
        set_permissions(admin_policy, admin_perms, tok)
    except Exception as e:
        print("warn: admin permissions not fully applied:", e, file=sys.stderr)
    print(f"OK: public policy {public_policy} (read on {len(PUBLIC_READ)} collections), "
          f"admin policy {admin_policy} ({len(admin_perms)} rules)")

    # Make the Directus admin UI default to Russian
    try:
        api("PATCH", "/settings", tok, {"default_language": "ru-RU"})
        print("OK: default admin language set to ru-RU")
    except Exception as e:
        print("warn: could not set default language:", e, file=sys.stderr)

    # --- diagnostics: confirm the field exists and the policy really has it ---
    try:
        rev_fields = api("GET", "/fields/reviews?fields=field", tok)["data"]
        print("DIAG reviews fields:", [f["field"] for f in rev_fields], file=sys.stderr)
    except Exception as e:
        print("DIAG fields err:", e, file=sys.stderr)
    try:
        pol = api("GET",
                  f"/policies/{public_policy}?fields=permissions.collection,permissions.action,permissions.fields",
                  tok)["data"]
        print("DIAG public permissions:", json.dumps(pol.get("permissions"), ensure_ascii=False), file=sys.stderr)
    except Exception as e:
        print("DIAG policy err:", e, file=sys.stderr)
    try:
        roles = api("GET", "/roles?fields=id,name,admin", tok)["data"]
        print("DIAG roles:", json.dumps(roles, ensure_ascii=False), file=sys.stderr)
    except Exception as e:
        print("DIAG roles err:", e, file=sys.stderr)


if __name__ == "__main__":
    main()
