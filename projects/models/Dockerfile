FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:shared
RUN npm run build:models

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist/models ./dist/models
ENV PORT=4201
EXPOSE 4201
CMD ["node", "dist/models/server/server.mjs"]
