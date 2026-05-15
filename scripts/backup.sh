#!/bin/bash
set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
DB_BACKUP="$BACKUP_DIR/db_$DATE.sql"
MEDIA_BACKUP="$BACKUP_DIR/media_$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "📦 Бэкап БД..."
docker exec postgres-kira pg_dump -U postgres studio > "$DB_BACKUP"
echo "✅ БД сохранена: $DB_BACKUP"

echo "📦 Бэкап медиафайлов..."
tar -czf "$MEDIA_BACKUP" -C ./apps/studio media/
echo "✅ Медиа сохранены: $MEDIA_BACKUP"

echo "🎉 Готово!"
