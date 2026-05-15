#!/bin/bash
set -e

echo "🚀 Deploy начат..."

echo "📦 Бэкап перед деплоем..."
bash scripts/backup.sh

echo "⬇️  Pull изменений..."
git pull origin main

echo "📦 Установка зависимостей..."
npm ci

echo "🔨 Сборка..."
npm run build -w main
npm run build -w models
npm run build -w studio

echo "♻️  Перезапуск PM2..."
pm2 reload ecosystem.config.cjs

echo "✅ Deploy завершён!"
