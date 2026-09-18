FROM directus/directus:12.0.2

# Directus' internal dependencies are not available to extensions. Install the
# packages used by convert-to-webp explicitly: image-manifest/to-webp
# (bundles sharp) for in-memory conversion and the AWS S3 client reads/writes
# objects in Garage.
USER root
RUN npm install -g image-manifest@2.2.0 "@aws-sdk/client-s3@3.987.0" \
  && ln -s /usr/local/lib/node_modules/image-manifest /directus/node_modules/image-manifest \
  && ln -s /usr/local/lib/node_modules/@aws-sdk /directus/node_modules/@aws-sdk
USER node
