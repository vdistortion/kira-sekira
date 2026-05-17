FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/studio/package.json ./apps/studio/

RUN npm ci --workspaces --include-workspace-root

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p apps/studio/public

RUN npm run generate:types -w studio
RUN npm run build -w studio

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/studio/.next/standalone ./
COPY --from=builder /app/apps/studio/.next/static ./apps/studio/.next/static
COPY --from=builder /app/apps/studio/public ./apps/studio/public

COPY --from=builder /app/apps/studio/src ./apps/studio/src
COPY --from=builder /app/apps/studio/tsconfig.json ./apps/studio/tsconfig.json
COPY --from=builder /app/tsconfig.root.json ./tsconfig.json

COPY --from=deps /app/node_modules ./node_modules

RUN mkdir -p /app/media && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
