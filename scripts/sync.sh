#!/usr/bin/env bash
# Синхронизация данных (БД + файлы) между локальным стеком и продом на VPS.
#
# Команды:
#   setup       — установить rclone (если нет) и прописать remote «garage»
#   check       — диагностика: rclone, .env, SSH, туннель, локальный стек
#   tunnel-up   — поднять SSH-туннель localhost:3900 -> VPS garage:3900
#   tunnel-down — снять туннель
#   db-pull     — прод -> локал: дамп БД + переключить storage на 'local'
#   db-push     — локал -> прод: дамп БД + переключить storage на 'garage'
#   files-pull  — прод -> локал: Garage -> локальный volume uploads
#   files-push  — локал -> прод: локальный volume uploads -> Garage
#   pull        — files-pull + db-pull
#   push        — files-push + db-push
#
# Требует в .env: VPS_SSH_HOST (или SSH-алиас), GARAGE_BUCKET,
# GARAGE_ACCESS_KEY_ID, GARAGE_SECRET_ACCESS_KEY. Опционально:
# GARAGE_ENDPOINT, GARAGE_REGION, VPS_REPO_DIR, LOCAL_UPLOADS.
#
# Важно: rclone sync — это зеркалирование (лишние файлы в приёмнике
# удаляются). Для предварительного просмотра задай DRY_RUN=1.

set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a; . ./.env; set +a
fi

RCLONE="$(command -v rclone 2>/dev/null || echo "$HOME/.local/bin/rclone")"
SSH_HOST="${VPS_SSH_HOST:-de}"
VPS_REPO_DIR="${VPS_REPO_DIR:-~/projects/kira-sekira}"
GARAGE_ENDPOINT="${GARAGE_ENDPOINT:-http://127.0.0.1:3900}"
GARAGE_REGION="${GARAGE_REGION:-garage}"
BACKUP_DIR="${BACKUP_DIR:-backups}"
TUNNEL_PORT="${GARAGE_TUNNEL_PORT:-3900}"
TUNNEL_SOCK="${TMPDIR:-/tmp}/kira-sekira-garage-tunnel.sock"

die() { echo "ОШИБКА: $*" >&2; exit 1; }

resolve_uploads() {
  if [ -n "${LOCAL_UPLOADS:-}" ]; then
    echo "$LOCAL_UPLOADS"
    return
  fi
  local vol
  vol="$(docker volume ls --format '{{.Name}}' | grep 'directus_uploads$' | head -1 || true)"
  if [ -n "$vol" ]; then
    docker volume inspect "$vol" --format '{{.Mountpoint}}'
  else
    echo "/var/lib/docker/volumes/kira-sekira_directus_uploads/_data"
  fi
}

need_garage_env() {
  : "${GARAGE_BUCKET:?В .env не задан GARAGE_BUCKET}"
  : "${GARAGE_ACCESS_KEY_ID:?В .env не задан GARAGE_ACCESS_KEY_ID}"
  : "${GARAGE_SECRET_ACCESS_KEY:?В .env не задан GARAGE_SECRET_ACCESS_KEY}"
}

rclone_flags() {
  local f=()
  [ "${DRY_RUN:-0}" = "1" ] && f+=(--dry-run)
  printf '%s\n' "${f[@]}"
}

# --- setup ---------------------------------------------------------------

setup() {
  if ! command -v "$RCLONE" >/dev/null 2>&1 && [ ! -x "$RCLONE" ]; then
    echo "rclone не найден. Скачиваю в ~/.local/bin ..."
    mkdir -p "$HOME/.local/bin"
    local tmp zip
    tmp="$(mktemp -d)"
    curl -sSL "https://github.com/rclone/rclone/releases/download/v1.69.1/rclone-v1.69.1-linux-amd64.zip" -o "$tmp/rclone.zip" \
      || die "не удалось скачать rclone"
    unzip -o -q "$tmp/rclone.zip" -d "$tmp"
    cp "$tmp"/rclone-*/rclone "$HOME/.local/bin/rclone"
    chmod +x "$HOME/.local/bin/rclone"
    rm -rf "$tmp"
  fi
  "$RCLONE" version | head -1

  need_garage_env
  mkdir -p "$HOME/.config/rclone"
  chmod 700 "$HOME/.config/rclone"
  cat > "$HOME/.config/rclone/rclone.conf" <<EOF
[garage]
type = s3
provider = Other
access_key_id = ${GARAGE_ACCESS_KEY_ID}
secret_access_key = ${GARAGE_SECRET_ACCESS_KEY}
endpoint = ${GARAGE_ENDPOINT}
region = ${GARAGE_REGION}
force_path_style = true
acl = private
EOF
  chmod 600 "$HOME/.config/rclone/rclone.conf"
  echo "remote «garage» записан (${GARAGE_ENDPOINT}, бакет ${GARAGE_BUCKET})."
}

# --- tunnel --------------------------------------------------------------

tunnel_up() {
  mkdir -p "$(dirname "$TUNNEL_SOCK")"
  if [ -S "$TUNNEL_SOCK" ]; then
    echo "Туннель уже поднят (сокет $TUNNEL_SOCK)."
    return 0
  fi
  echo "Поднимаю туннель ${TUNNEL_PORT} -> ${SSH_HOST}:127.0.0.1:${TUNNEL_PORT} ..."
  ssh -M -S "$TUNNEL_SOCK" -f -N -L "${TUNNEL_PORT}:127.0.0.1:${TUNNEL_PORT}" "$SSH_HOST" \
    || die "не удалось поднять туннель (SSH-хост $SSH_HOST достижим?)"
  echo "Туннель поднят. Снять: make tunnel-down"
}

tunnel_down() {
  if [ -S "$TUNNEL_SOCK" ]; then
    ssh -S "$TUNNEL_SOCK" -O exit "$SSH_HOST" >/dev/null 2>&1 || true
    rm -f "$TUNNEL_SOCK"
    echo "Туннель снят."
  else
    echo "Туннель не поднят."
  fi
}

tunnel_ok() {
  curl -s -o /dev/null --max-time 3 "${GARAGE_ENDPOINT}/" 2>/dev/null
}

# --- check ---------------------------------------------------------------

check() {
  local ok=1
  if "$RCLONE" version >/dev/null 2>&1; then
    echo "[ok] rclone: $("$RCLONE" version | head -1)"
  else
    echo "[--] rclone не найден — выполни make sync-setup"; ok=0
  fi
  if [ -n "${GARAGE_BUCKET:-}" ] && [ -n "${GARAGE_ACCESS_KEY_ID:-}" ] && [ -n "${GARAGE_SECRET_ACCESS_KEY:-}" ]; then
    echo "[ok] .env: GARAGE_* заданы (бакет ${GARAGE_BUCKET})"
  else
    echo "[--] .env: не все GARAGE_* заданы"; ok=0
  fi
  if ssh -o ConnectTimeout=5 -o BatchMode=yes "$SSH_HOST" true >/dev/null 2>&1; then
    echo "[ok] SSH до $SSH_HOST"
  else
    echo "[--] SSH до $SSH_HOST недоступен"; ok=0
  fi
  if tunnel_ok; then
    echo "[ok] туннель до Garage (${GARAGE_ENDPOINT})"
  else
    echo "[--] туннель не поднят — выполни make tunnel-up"; ok=0
  fi
  if docker compose ps --status running studio >/dev/null 2>&1; then
    echo "[ok] локальный стек запущен"
  else
    echo "[--] локальный стек не запущен — выполни make schema-dev"; ok=0
  fi
  echo
  [ "$ok" = "1" ] && echo "Всё готово для make pull / make push." || echo "Устрани отмеченные [--] пункты."
}

# --- db ------------------------------------------------------------------

db_pull() {
  mkdir -p "$BACKUP_DIR"
  echo "Дамп БД с прода ($SSH_HOST) ..."
  ssh "$SSH_HOST" "cd $VPS_REPO_DIR && docker compose -f compose.release.yaml exec -T db pg_dump -U postgres -Fc --no-owner studio" \
    > "$BACKUP_DIR/prod-latest.dump"
  echo "Восстанавливаю в локальную БД ..."
  docker compose stop studio >/dev/null
  docker compose exec -T db pg_restore -U postgres --clean --if-exists --no-owner -d studio < "$BACKUP_DIR/prod-latest.dump"
  echo "UPDATE directus_files SET storage='local';" | docker compose exec -T db psql -U postgres -d studio
  docker compose start studio >/dev/null
  echo "Готово: прод -> локал (БД). Админ-логин теперь как на проде."
}

db_push() {
  mkdir -p "$BACKUP_DIR"
  echo "Дамп локальной БД ..."
  docker compose exec -T db pg_dump -U postgres -Fc --no-owner studio > "$BACKUP_DIR/local-latest.dump"
  echo "Останавливаю prod studio, восстанавливаю БД, переключаю storage, запускаю ..."
  ssh "$SSH_HOST" "cd $VPS_REPO_DIR && docker compose -f compose.release.yaml stop studio"
  ssh "$SSH_HOST" "cd $VPS_REPO_DIR && docker compose -f compose.release.yaml exec -T db pg_restore -U postgres --clean --if-exists --no-owner -d studio" \
    < "$BACKUP_DIR/local-latest.dump"
  echo "UPDATE directus_files SET storage='garage';" | \
    ssh "$SSH_HOST" "cd $VPS_REPO_DIR && docker compose -f compose.release.yaml exec -T db psql -U postgres -d studio"
  ssh "$SSH_HOST" "cd $VPS_REPO_DIR && docker compose -f compose.release.yaml start studio"
  echo "Готово: локал -> прод (БД)."
}

# --- files ---------------------------------------------------------------

files_pull() {
  need_garage_env
  tunnel_ok || die "Garage недоступен. Подними туннель: make tunnel-up"
  local dst
  dst="$(resolve_uploads)"
  mkdir -p "$dst"
  echo "Garage -> локальные uploads ($dst) ..."
  # shellcheck disable=SC2046
  "$RCLONE" sync "garage:${GARAGE_BUCKET}/" "$dst/" $(rclone_flags) --progress
  echo "Готово: прод -> локал (файлы)."
}

files_push() {
  need_garage_env
  tunnel_ok || die "Garage недоступен. Подними туннель: make tunnel-up"
  local src
  src="$(resolve_uploads)"
  echo "Локальные uploads ($src) -> Garage ..."
  # shellcheck disable=SC2046
  "$RCLONE" sync "$src/" "garage:${GARAGE_BUCKET}/" $(rclone_flags) --progress
  echo "Готово: локал -> прод (файлы)."
}

# --- combined ------------------------------------------------------------

pull() { files_pull; db_pull; }
push() { files_push; db_push; }

# --- dispatch ------------------------------------------------------------

case "${1:-}" in
  setup)      setup ;;
  check)      check ;;
  tunnel-up)  tunnel_up ;;
  tunnel-down) tunnel_down ;;
  db-pull)    db_pull ;;
  db-push)    db_push ;;
  files-pull) files_pull ;;
  files-push) files_push ;;
  pull)       pull ;;
  push)       push ;;
  *)
    sed -n '2,20p' "$0"
    exit 1
    ;;
esac
