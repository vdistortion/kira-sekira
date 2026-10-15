#!/usr/bin/env python3
"""Audit and safely remove old Directus files with no known relations.

By default this is a read-only audit. Deletion requires --apply, a fresh
relation scan, and typing the exact confirmation phrase shown by the script.
Files younger than the configured grace period are never candidates.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PAGE_SIZE = 200
DEFAULT_AGE_DAYS = 30


class CleanupError(RuntimeError):
    pass


def request_json(
    base: str,
    method: str,
    path: str,
    token: str | None = None,
    body: dict[str, Any] | None = None,
) -> Any:
    payload = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    request = urllib.request.Request(
        base + path, data=payload, method=method, headers=headers
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise CleanupError(
            f"Directus returned HTTP {error.code} for {method} {path}: {detail}"
        ) from error
    except OSError as error:
        raise CleanupError(f"Directus request failed for {method} {path}: {error}") from error
    if not raw:
        return None
    try:
        envelope = json.loads(raw)
    except json.JSONDecodeError as error:
        raise CleanupError(f"Unexpected response for {method} {path}") from error
    if envelope.get("errors"):
        raise CleanupError(f"Directus error for {method} {path}: {envelope['errors']}")
    return envelope.get("data")


def login(base: str) -> str:
    email = os.environ.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD")
    if not email or not password:
        raise CleanupError("Set ADMIN_EMAIL and ADMIN_PASSWORD (usually via .env).")
    result = request_json(
        base,
        "POST",
        "/auth/login",
        body={"email": email, "password": password},
    )
    token = (result or {}).get("access_token")
    if not token:
        raise CleanupError("Directus login did not return an access token.")
    return token


def pages(base: str, token: str, path: str, fields: list[str]) -> list[dict[str, Any]]:
    """Read a collection in bounded pages; singleton endpoints return one row."""
    query_fields = ",".join(fields)
    rows: list[dict[str, Any]] = []
    offset = 0
    while True:
        query = urllib.parse.urlencode(
            {"limit": PAGE_SIZE, "offset": offset, "fields": query_fields}
        )
        page = request_json(base, "GET", path + "?" + query, token)
        if page is None:
            return rows
        if isinstance(page, dict):
            rows.append(page)
            return rows
        if not isinstance(page, list):
            raise CleanupError(f"Unexpected collection response from {path}")
        rows.extend(page)
        if len(page) < PAGE_SIZE:
            return rows
        offset += len(page)


def endpoint_for_collection(collection: str) -> str:
    # Directus system collections with dedicated endpoints cannot be read via
    # /items/<collection> under the administrator's normal item permissions.
    if collection == "directus_settings":
        return "/settings"
    if collection == "directus_users":
        return "/users"
    return "/items/" + urllib.parse.quote(collection, safe="")


def read_relation_rows(
    base: str, token: str, collection: str, field: str
) -> list[dict[str, Any]]:
    if collection == "directus_settings":
        query = urllib.parse.urlencode({"fields": field})
        row = request_json(base, "GET", "/settings?" + query, token)
        return [row] if isinstance(row, dict) else []
    fields = ["id", field]
    if collection == "gallery_images" and field == "image":
        # A file in a gallery_images row with no parent gallery is an orphaned
        # junction, not an active content use. Leave that junction for the
        # separate future relationship-cleanup task.
        fields.append("gallery")
    return pages(base, token, endpoint_for_collection(collection), fields)


def relation_sources(base: str, token: str) -> list[tuple[str, str]]:
    relations = request_json(base, "GET", "/relations?limit=-1", token)
    if not isinstance(relations, list):
        raise CleanupError("Could not read Directus relationship metadata.")
    sources = {
        (relation.get("collection"), relation.get("field"))
        for relation in relations
        if relation.get("related_collection") == "directus_files"
        or (relation.get("meta") or {}).get("one_collection") == "directus_files"
    }
    if not sources or any(not collection or not field for collection, field in sources):
        raise CleanupError("Directus returned incomplete file relationship metadata.")
    return sorted(sources)


def value_ids(value: Any) -> set[str]:
    if value is None:
        return set()
    if isinstance(value, str):
        return {value}
    if isinstance(value, dict):
        identifier = value.get("id")
        return {str(identifier)} if identifier is not None else set()
    if isinstance(value, list):
        result: set[str] = set()
        for item in value:
            result.update(value_ids(item))
        return result
    return set()


def collect_references(
    base: str, token: str
) -> tuple[dict[str, list[str]], int]:
    """Return file-id -> Directus relation locations; abort if any source is unreadable."""
    references: dict[str, list[str]] = {}
    sources = relation_sources(base, token)
    for collection, field in sources:
        rows = read_relation_rows(base, token, collection, field)
        for row in rows:
            if collection == "gallery_images" and field == "image" and not row.get("gallery"):
                continue
            location = f"{collection}.{field}"
            if row.get("id") is not None:
                location += f" (item {row['id']})"
            for file_id in value_ids(row.get(field)):
                references.setdefault(file_id, []).append(location)
    return references, len(sources)


def get_files(base: str, token: str) -> list[dict[str, Any]]:
    return pages(
        base,
        token,
        "/files",
        [
            "id",
            "storage",
            "filename_disk",
            "filename_download",
            "title",
            "type",
            "filesize",
            "created_on",
            "uploaded_on",
        ],
    )


def parse_date(value: Any) -> datetime | None:
    if not value or not isinstance(value, str):
        return None
    try:
        result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if result.tzinfo is None:
        result = result.replace(tzinfo=timezone.utc)
    return result.astimezone(timezone.utc)


def find_candidates(
    files: list[dict[str, Any]],
    references: dict[str, list[str]],
    age_days: int,
) -> tuple[list[dict[str, Any]], int]:
    now = datetime.now(timezone.utc)
    cutoff = now.timestamp() - age_days * 24 * 60 * 60
    candidates = []
    unknown_age = 0
    for item in files:
        if str(item.get("id")) in references:
            continue
        created = parse_date(item.get("uploaded_on")) or parse_date(item.get("created_on"))
        if created is None:
            unknown_age += 1
            continue
        if created.timestamp() <= cutoff:
            item["age_days"] = (now - created).days
            candidates.append(item)
    candidates.sort(key=lambda item: (-int(item.get("filesize") or 0), item["id"]))
    return candidates, unknown_age


def human_size(value: Any) -> str:
    size = int(value or 0)
    for unit in ("B", "KiB", "MiB", "GiB"):
        if size < 1024 or unit == "GiB":
            return f"{size:.1f} {unit}" if unit != "B" else f"{size} B"
        size /= 1024
    return f"{size:.1f} GiB"


def print_report(
    files: list[dict[str, Any]],
    references: dict[str, list[str]],
    candidates: list[dict[str, Any]],
    unknown_age: int,
    relation_count: int,
    age_days: int,
) -> None:
    total_bytes = sum(int(item.get("filesize") or 0) for item in candidates)
    print(f"Directus files scanned: {len(files)}")
    print(f"File relationship fields scanned: {relation_count}")
    print(f"Known file references found: {sum(map(len, references.values()))}")
    print(f"Unreferenced files older than {age_days} days: {len(candidates)} ({human_size(total_bytes)})")
    if unknown_age:
        print(f"Skipped because their age is unknown: {unknown_age}")
    if not candidates:
        return
    print("\nCandidates (review before deletion):")
    for item in candidates:
        title = item.get("title") or ""
        filename = item.get("filename_download") or item.get("filename_disk") or ""
        print(
            f"{item['id']}\t{item.get('age_days', '?')}d\t{human_size(item.get('filesize'))}"
            f"\t{item.get('storage') or '?'}\t{title}\t{filename}"
        )
    print(
        "\nWarning: this audit follows Directus relationship fields. "
        "Review manually embedded asset URLs/Markdown before applying."
    )


def write_csv(path: str, candidates: list[dict[str, Any]]) -> None:
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("w", newline="", encoding="utf-8") as output:
        writer = csv.DictWriter(
            output,
            fieldnames=[
                "id",
                "age_days",
                "storage",
                "type",
                "filesize",
                "title",
                "filename_download",
                "filename_disk",
            ],
            extrasaction="ignore",
        )
        writer.writeheader()
        writer.writerows(candidates)
    print(f"Report written to {target}")


def delete_candidates(
    base: str,
    token: str,
    candidates: list[dict[str, Any]],
    age_days: int,
) -> None:
    if not candidates:
        print("Nothing to delete.")
        return
    phrase = f"DELETE {len(candidates)} FILES"
    print("Deletion is permanent and removes binaries from Directus storage.")
    print("Make and verify database + upload-storage backups before continuing.")
    try:
        answer = input(f"Type exactly {phrase!r} to proceed: ")
    except EOFError:
        raise CleanupError("No interactive confirmation received; nothing was deleted.")
    if answer != phrase:
        print("Confirmation did not match; nothing was deleted.")
        return

    # Re-scan immediately before applying to reduce the chance that an asset
    # became linked after the report was generated.
    references, _ = collect_references(base, token)
    current_files = {item["id"]: item for item in get_files(base, token)}
    fresh, _ = find_candidates(list(current_files.values()), references, age_days)
    fresh_ids = {item["id"] for item in fresh}
    requested_ids = {item["id"] for item in candidates}
    safe_ids = requested_ids & fresh_ids
    skipped = requested_ids - safe_ids
    if skipped:
        print(f"Skipped {len(skipped)} files that changed or became referenced since the audit.")
    deleted = 0
    for index, item in enumerate(candidates, start=1):
        if item["id"] not in safe_ids:
            continue
        try:
            request_json(
                base,
                "DELETE",
                "/files/" + urllib.parse.quote(item["id"], safe=""),
                token,
            )
        except CleanupError as error:
            raise CleanupError(f"Deletion stopped after {deleted} file(s): {error}") from error
        deleted += 1
        print(f"Deleted {index}/{len(candidates)}: {item.get('filename_download') or item['id']}")
    print(f"Deletion complete: {deleted} file(s) removed.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--older-than-days",
        type=int,
        default=DEFAULT_AGE_DAYS,
        help=f"minimum age for candidates (default: {DEFAULT_AGE_DAYS})",
    )
    parser.add_argument("--apply", action="store_true", help="permanently delete reviewed candidates")
    parser.add_argument("--report", help="also save candidate details as CSV")
    args = parser.parse_args()
    if args.older_than_days < 0:
        parser.error("--older-than-days must be 0 or greater")

    base = os.environ.get("DIRECTUS_URL", "http://127.0.0.1:8055").rstrip("/")
    try:
        token = login(base)
        references, relation_count = collect_references(base, token)
        files = get_files(base, token)
        candidates, unknown_age = find_candidates(files, references, args.older_than_days)
        print_report(files, references, candidates, unknown_age, relation_count, args.older_than_days)
        if args.report:
            write_csv(args.report, candidates)
        if args.apply:
            delete_candidates(base, token, candidates, args.older_than_days)
        else:
            print("\nRead-only audit; use --apply only after reviewing the report and verifying backups.")
        return 0
    except CleanupError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        if args.apply:
            print("If deletion had started, review the report and restore from backup if needed.", file=sys.stderr)
        else:
            print("No deletion was performed.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
