FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:shared
RUN npm run build:main

FROM caddy:2-alpine
COPY --from=build /app/dist/main/browser /srv
COPY projects/main/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
