FROM directus/directus:12.0.2

# Install the project's own image-manifest library globally (it pulls sharp as a
# dependency) and symlink it into /directus/node_modules so the convert-to-webp
# extension can `import` it for on-upload webp conversion.
USER root
RUN npm install -g image-manifest
RUN ln -s /usr/local/lib/node_modules/image-manifest /directus/node_modules/image-manifest
USER node
