FROM node:22-alpine AS build
WORKDIR /app
# Копируем файлы монорепозитория, чтобы npm ci сработал
COPY package*.json ./
COPY apps/site/package*.json ./apps/site/
# Установка всех зависимостей (включая dev, т.к. Angular build требует devDependencies)
RUN npm ci --workspaces --include-workspace-root
# Копируем исходники
COPY . .
# Собираем только main с production-конфигурацией
RUN npm run build -w @kira-sekira/site -- --configuration production

FROM node:22-alpine
WORKDIR /app
# Копируем production-зависимости только для site
COPY package*.json ./
COPY apps/site/package*.json ./apps/site/
RUN npm ci --workspace=@kira-sekira/site --omit=dev --ignore-scripts
# Копируем собранный сервер
COPY --from=build /app/apps/site/dist ./dist
ENV PORT=4000
EXPOSE 4000
CMD ["node", "dist/site/server/server.mjs"]
