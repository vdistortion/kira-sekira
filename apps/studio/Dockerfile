FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/studio/package*.json ./apps/studio/
RUN npm ci --workspace=studio --include-workspace-root
COPY . .
RUN mkdir -p apps/studio/public
RUN npm run generate:types -w studio
RUN npm run build -w studio

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/studio/package*.json ./apps/studio/
RUN npm ci --workspace=studio --omit=dev --ignore-scripts
COPY --from=build /app/apps/studio/.next ./.next
COPY --from=build /app/apps/studio/public ./public
COPY --from=build /app/apps/studio/next.config.ts ./
COPY --from=build /app/apps/studio/tsconfig.json ./
RUN mkdir -p /app/media
ENV PORT=3000
EXPOSE 3000
CMD ["npx", "next", "start"]
