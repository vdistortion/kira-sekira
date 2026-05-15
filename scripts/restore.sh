#!/bin/bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Использование: ./scripts/restore.sh <db_backup.sql> <media_backup.tar.gz>"
  exit 1
fi

DB_BACKUP="$1"
MEDIA_BACKUP="$2"

echo "♻️  Восстановление БД из $DB_BACKUP..."
docker exec -i postgres-kira psql -U postgres -c "DROP DATABASE IF EXISTS studio;"
docker exec -i postgres-kira psql -U postgres -c "CREATE DATABASE studio;"
docker exec -i postgres-kira psql -U postgres studio < "$DB_BACKUP"
echo "✅ БД восстановлена"

echo "♻️  Восстановление медиафайлов из $MEDIA_BACKUP..."
rm -rf ./apps/studio/media/
tar -xzf "$MEDIA_BACKUP" -C ./apps/studio/
echo "✅ Медиа восстановлены"

echo "🎉 Готово!"
