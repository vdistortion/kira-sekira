FROM directus/directus:12.0.2

# Directus 12 is installed with pnpm, so `npm install` in /directus fails. Install
# sharp globally and expose it via NODE_PATH so the convert-to-webp extension can
# `require('sharp')` to re-encode uploaded images to webp on upload.
USER root
RUN npm install -g sharp
ENV NODE_PATH=/usr/local/lib/node_modules
USER node
