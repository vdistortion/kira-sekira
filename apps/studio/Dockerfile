FROM node:22-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/studio/package*.json ./apps/studio/
RUN npm ci --workspace=studio --include-workspace-root
COPY . .
RUN mkdir -p apps/studio/public
RUN npm run generate:types -w studio
RUN npm run build -w studio

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/studio/.next/standalone ./
COPY --from=build /app/apps/studio/.next/static ./apps/studio/.next/static
COPY --from=build /app/apps/studio/public ./apps/studio/public
COPY --from=build /app/apps/studio/src ./apps/studio/src
COPY --from=build /app/apps/studio/tsconfig.json ./
COPY --from=build /app/apps/studio/src ./src
RUN mkdir -p /app/media
ENV PORT=3000
EXPOSE 3000
CMD ["node", "apps/studio/server.js"]
