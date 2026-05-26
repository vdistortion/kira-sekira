FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/models/package*.json ./apps/models/
RUN npm ci --workspaces --include-workspace-root
COPY . .
RUN npm run build -w @kira-sekira/models -- --configuration production

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/models/package*.json ./apps/models/
RUN npm ci --workspace=models --omit=dev --ignore-scripts
COPY --from=build /app/apps/models/dist ./dist
ENV PORT=4201
EXPOSE 4201
CMD ["node", "dist/models/server/server.mjs"]
