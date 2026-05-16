FROM node:22-alpine AS build
WORKDIR /app
# Копируем файлы монорепозитория, чтобы npm ci сработал
COPY package*.json ./
COPY apps/main/package*.json ./apps/main/
# Установка всех зависимостей (включая dev, т.к. Angular build требует devDependencies)
RUN npm ci --workspaces --include-workspace-root
# Копируем исходники
COPY . .
# Собираем только main с production-конфигурацией
RUN npm run build -w main -- --configuration production

FROM node:22-alpine
WORKDIR /app
# Копируем production-зависимости только для main
COPY package*.json ./
COPY apps/main/package*.json ./apps/main/
RUN npm ci --workspace=main --omit=dev --ignore-scripts
# Копируем собранный сервер
COPY --from=build /app/apps/main/dist ./dist
ENV PORT=4000
EXPOSE 4000
CMD ["node", "dist/main/server/server.mjs"]
