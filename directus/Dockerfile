FROM directus/directus:12.0.2

# Directus' internal dependencies are not available to extensions. Install the
# packages used by convert-to-webp explicitly: sharp transforms uploads in
# memory and the AWS S3 client reads/writes objects in Garage.
USER root
RUN npm install -g sharp@0.35.2 @aws-sdk/client-s3@3.987.0 \
  && ln -s /usr/local/lib/node_modules/sharp /directus/node_modules/sharp \
  && ln -s /usr/local/lib/node_modules/@aws-sdk /directus/node_modules/@aws-sdk
USER node
