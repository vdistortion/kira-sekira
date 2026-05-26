#!/bin/bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Использование: ./scripts/restore.sh <db_backup.sql> <media_backup.tar.gz>"
  exit 1
fi

DB_BACKUP="$1"
MEDIA_BACKUP="$2"

echo "♻️  Остановка студии..."
docker compose -f docker-compose.release.yml stop studio

echo "♻️  Восстановление БД из $DB_BACKUP..."
docker exec -i kira-postgres-release psql -U postgres -c "DROP DATABASE IF EXISTS studio;"
docker exec -i kira-postgres-release psql -U postgres -c "CREATE DATABASE studio;"
docker exec -i kira-postgres-release psql -U postgres studio < "$DB_BACKUP"
echo "✅ БД восстановлена"

echo "♻️  Восстановление медиафайлов..."
docker run --rm -v kira-sekira-release_studio_media_release:/data -v "$(pwd)":/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/$(basename "$MEDIA_BACKUP") -C /data"
echo "✅ Медиа восстановлены"

echo "♻️  Запуск студии..."
docker compose -f docker-compose.release.yml start studio

echo "🎉 Готово!"
