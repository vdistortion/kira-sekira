FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:shared
RUN npm run build:models

FROM caddy:2-alpine
COPY --from=build /app/dist/models/browser /srv
COPY projects/models/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
