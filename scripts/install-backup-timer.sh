#!/usr/bin/env bash
# Одноразовая установка production-бэкапа на VPS.
set -euo pipefail

cd "$(dirname "$0")/.."
PROJECT_DIR="$PWD"
SERVICE="kira-sekira-backup"
USER_NAME="$(id -un)"

command -v docker >/dev/null || { echo 'Нужен Docker' >&2; exit 1; }
command -v rclone >/dev/null || {
  echo 'Нужен rclone. Установите его командой: make sync-setup' >&2
  exit 1
}
[ -f .env ] || { echo 'ОШИБКА: сначала создайте production .env' >&2; exit 1; }

sudo install -m 0755 scripts/backup.sh "/usr/local/bin/${SERVICE}.sh"
sudo tee "/etc/systemd/system/${SERVICE}.service" >/dev/null <<EOF
[Unit]
Description=Kira Sekira production backup
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
User=${USER_NAME}
WorkingDirectory=${PROJECT_DIR}
ExecStart=/usr/local/bin/${SERVICE}.sh
EOF

sudo tee "/etc/systemd/system/${SERVICE}.timer" >/dev/null <<EOF
[Unit]
Description=Daily Kira Sekira production backup

[Timer]
OnCalendar=*-*-* 03:30:00
Persistent=true
RandomizedDelaySec=15m

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now "${SERVICE}.timer"

echo "Таймер установлен. Проверка: systemctl list-timers ${SERVICE}.timer"
echo "Ручной запуск: sudo systemctl start ${SERVICE}.service"
