import { stat, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const MAX_IMAGE_SIDE = 1000;
const WEBP_MIME_TYPE = 'image/webp';

function toWebpFilename(filename) {
  const stem = filename.replace(/\.[^./\\]+$/, '');
  return `${stem}.webp`;
}

async function streamToBuffer(body) {
  const chunks = [];
  for await (const chunk of body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function createGarageClient(env) {
  return new S3Client({
    endpoint: env.STORAGE_GARAGE_ENDPOINT,
    region: env.STORAGE_GARAGE_REGION,
    forcePathStyle: String(env.STORAGE_GARAGE_FORCE_PATH_STYLE) === 'true',
    credentials: {
      accessKeyId: env.STORAGE_GARAGE_KEY,
      secretAccessKey: env.STORAGE_GARAGE_SECRET,
    },
  });
}

async function convertToWebp(input) {
  const buffer = await sharp(input, { animated: true, limitInputPixels: false })
    .resize(MAX_IMAGE_SIDE, MAX_IMAGE_SIDE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const metadata = await sharp(buffer).metadata();
  return { buffer, width: metadata.width ?? null, height: metadata.height ?? null };
}

/**
 * Converts uploaded raster images to WebP with a maximum side of 1000px.
 * WebP and SVG files are left unchanged. The source object is removed only
 * after its WebP replacement is stored successfully.
 */
export default function registerHook({ action }, { services, getSchema, env, logger }) {
  const { ItemsService } = services;
  const UPLOAD_DIR = env.STORAGE_LOCAL_ROOT || '/directus/uploads';

  action('files.upload', async (meta, context) => {
    const database = context.database;
    const schema = await getSchema();

    try {
      const id = meta?.key ?? meta?.payload?.id;
      if (!id) return;

      const items = new ItemsService('directus_files', { schema, knex: database, env });
      const file = await items.readOne(id);

      if (!file?.type?.startsWith('image/')) return;
      if (file.type === WEBP_MIME_TYPE) return;
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/avif'].includes(file.type)) {
        logger?.warn?.(`[convert-to-webp] unsupported image type: ${file.type}`);
        return;
      }

      const srcDisk = file.filename_disk;
      const newDisk = toWebpFilename(srcDisk);
      const newDownload = toWebpFilename(file.filename_download || srcDisk);
      let converted;

      if (file.storage === 'garage') {
        const client = createGarageClient(env);
        const bucket = env.STORAGE_GARAGE_BUCKET;
        const source = await client.send(new GetObjectCommand({ Bucket: bucket, Key: srcDisk }));

        if (!source.Body) throw new Error(`Garage object ${srcDisk} has no body`);
        converted = await convertToWebp(await streamToBuffer(source.Body));

        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: newDisk,
            Body: converted.buffer,
            ContentType: WEBP_MIME_TYPE,
          }),
        );
      } else if (!file.storage || file.storage === 'local') {
        const srcPath = join(UPLOAD_DIR, srcDisk);
        const newPath = join(UPLOAD_DIR, newDisk);
        converted = await convertToWebp(srcPath);
        await writeFile(newPath, converted.buffer);
      } else {
        logger?.warn?.(`[convert-to-webp] unsupported storage: ${file.storage}`);
        return;
      }

      let size = converted.buffer.length;
      if (file.storage === 'local') {
        try {
          size = (await stat(join(UPLOAD_DIR, newDisk))).size;
        } catch {
          // The in-memory output size is already accurate.
        }
      }

      await items.updateOne(id, {
        filename_disk: newDisk,
        filename_download: newDownload,
        type: WEBP_MIME_TYPE,
        filesize: size,
        width: converted.width,
        height: converted.height,
      });

      if (newDisk !== srcDisk) {
        if (file.storage === 'garage') {
          const client = createGarageClient(env);
          await client.send(new DeleteObjectCommand({ Bucket: env.STORAGE_GARAGE_BUCKET, Key: srcDisk }));
        } else {
          await unlink(join(UPLOAD_DIR, srcDisk)).catch(() => {});
        }
      }

      logger?.info?.(`[convert-to-webp] ${id} -> ${newDisk} (${size} bytes)`);
    } catch (err) {
      logger?.error?.('[convert-to-webp] failed: ' + (err?.message || err));
    }
  });
}
