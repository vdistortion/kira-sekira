import { createRequire } from 'node:module';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
let sharp = null;
try {
  sharp = require('sharp');
} catch {
  // sharp is optional; without it the extension is a no-op.
}

/**
 * Directus hook: when a non-webp image is uploaded, convert it to webp and
 * replace the stored file (mirrors the image-manifest tool: sharp webp, default
 * quality, no resize). Non-image files and already-webp images pass through
 * untouched. Failures are logged but never block the upload.
 *
 * Storage is the local driver, so we read/write the file directly under the
 * uploads root (STORAGE_LOCAL_ROOT, default /directus/uploads).
 */
export default function registerHook({ action }, { services, getSchema, env, logger }) {
  const { ItemsService } = services;
  const UPLOAD_DIR = env.STORAGE_LOCAL_ROOT || '/directus/uploads';

  action('files.upload', async (meta, context) => {
    if (!sharp) return;
    const database = context.database;
    const schema = await getSchema();
    try {
      const id = meta?.key ?? meta?.payload?.id;
      if (!id) return;

      const items = new ItemsService('directus_files', { schema, knex: database, env });
      const file = await items.readOne(id);
      if (!file || !file.type || !file.type.startsWith('image/')) return;
      if (file.type === 'image/webp') return;

      const srcPath = join(UPLOAD_DIR, file.filename_disk);
      let input;
      try {
        input = await readFile(srcPath);
      } catch {
        return;
      }

      const webp = await sharp(input, { animated: true, limitInputPixels: false })
        .webp({ quality: 82 })
        .toBuffer();
      const info = await sharp(webp).metadata();

      const newDisk = file.filename_disk.replace(/\.[^./\\]+$/, '.webp');
      const newPath = join(UPLOAD_DIR, newDisk);
      await writeFile(newPath, webp);
      if (newDisk !== file.filename_disk) {
        await unlink(srcPath).catch(() => {});
      }
      const newDownload = (file.filename_download || file.filename_disk).replace(/\.[^./\\]+$/, '.webp');

      await items.updateOne(id, {
        filename_disk: newDisk,
        filename_download: newDownload,
        type: 'image/webp',
        filesize: webp.length,
        width: info.width ?? null,
        height: info.height ?? null,
      });

      logger?.info?.('[convert-to-webp] ' + id + ' -> ' + newDisk);
    } catch (err) {
      logger?.error?.('[convert-to-webp] failed: ' + (err?.message || err));
    }
  });
}
