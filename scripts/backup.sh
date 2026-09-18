#!/usr/bin/env bash
# Создаёт резервную копию production PostgreSQL и зеркала Garage.
# Скрипт запускается на VPS из каталога проекта через systemd timer.
set -euo pipefail

cd "$(dirname "$0")/.."
[ -f .env ] || { echo 'ОШИБКА: .env не найден' >&2; exit 1; }
set -a; . ./.env; set +a

BACKUP_DIR="${BACKUP_DIR:-$PWD/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
RCLONE="${RCLONE_BIN:-$(command -v rclone 2>/dev/null || echo "$HOME/.local/bin/rclone")}"
LOCK_FILE="${BACKUP_LOCK_FILE:-/tmp/kira-sekira-backup.lock}"

: "${GARAGE_BUCKET:?В .env не задан GARAGE_BUCKET}"
: "${GARAGE_ACCESS_KEY_ID:?В .env не задан GARAGE_ACCESS_KEY_ID}"
: "${GARAGE_SECRET_ACCESS_KEY:?В .env не задан GARAGE_SECRET_ACCESS_KEY}"

mkdir -p "$BACKUP_DIR/db" "$BACKUP_DIR/files" "$BACKUP_DIR/state"
exec 9>"$LOCK_FILE"
flock -n 9 || { echo 'Другой бэкап уже выполняется — выходим.'; exit 0; }

# Дамп сначала создаётся во временный файл. Новый снимок сохраняем только если
# его SHA-256 отличается от последнего сохранённого дампа.
STAMP="$(date +%Y%m%d-%H%M%S)"
TMP_DUMP="$BACKUP_DIR/state/studio-$STAMP.dump.tmp"
LATEST_DUMP="$(find "$BACKUP_DIR/db" -maxdepth 1 -type f -name 'studio-*.dump' -printf '%T@ %p\n' | sort -nr | head -1 | cut -d' ' -f2- || true)"

echo "Создаю временный дамп PostgreSQL..."
docker compose -f compose.release.yaml exec -T db pg_dump -U postgres -Fc --no-owner studio > "$TMP_DUMP"
NEW_HASH="$(sha256sum "$TMP_DUMP" | cut -d' ' -f1)"
OLD_HASH=""
[ -n "$LATEST_DUMP" ] && OLD_HASH="$(sha256sum "$LATEST_DUMP" | cut -d' ' -f1)"
if [ "$NEW_HASH" = "$OLD_HASH" ]; then
  rm -f "$TMP_DUMP"
  echo 'БД не изменилась — новый дамп не сохраняю.'
else
  mv "$TMP_DUMP" "$BACKUP_DIR/db/studio-$STAMP.dump"
  echo "$NEW_HASH  studio-$STAMP.dump" > "$BACKUP_DIR/db/studio-$STAMP.sha256"
  echo "Сохранён новый дамп: studio-$STAMP.dump"
fi

# Настраиваем временный rclone remote к loopback-порту Garage на VPS.
RCLONE_CONFIG="$BACKUP_DIR/state/rclone.conf"
cat > "$RCLONE_CONFIG" <<EOF
[garage]
type = s3
provider = Other
access_key_id = ${GARAGE_ACCESS_KEY_ID}
secret_access_key = ${GARAGE_SECRET_ACCESS_KEY}
endpoint = ${GARAGE_ENDPOINT:-http://127.0.0.1:3900}
region = ${GARAGE_REGION:-garage}
force_path_style = true
acl = private
EOF
chmod 600 "$RCLONE_CONFIG"

FILES_MANIFEST="$BACKUP_DIR/state/files.manifest"
NEW_MANIFEST="$BACKUP_DIR/state/files.manifest.new"
"$RCLONE" --config "$RCLONE_CONFIG" lsf "garage:${GARAGE_BUCKET}/" --recursive --format 'psth' | sort > "$NEW_MANIFEST"
if [ -f "$FILES_MANIFEST" ] && cmp -s "$FILES_MANIFEST" "$NEW_MANIFEST"; then
  echo 'Файлы Garage не изменились — синхронизацию не запускаю.'
  rm -f "$NEW_MANIFEST"
else
  echo 'Синхронизирую изменившиеся файлы Garage...'
  "$RCLONE" --config "$RCLONE_CONFIG" sync "garage:${GARAGE_BUCKET}/" "$BACKUP_DIR/files/" --delete-during --progress
  mv "$NEW_MANIFEST" "$FILES_MANIFEST"
  date -Is > "$BACKUP_DIR/state/files.synced-at"
  echo 'Зеркало файлов обновлено.'
fi

find "$BACKUP_DIR/db" -type f -name 'studio-*.dump' -mtime "+$RETENTION_DAYS" -delete
find "$BACKUP_DIR/db" -type f -name 'studio-*.sha256' -mtime "+$RETENTION_DAYS" -delete
rm -f "$RCLONE_CONFIG"
echo "Бэкап завершён: $(date -Is)"
