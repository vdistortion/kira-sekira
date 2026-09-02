import { stat, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { imageProcessing } from 'image-manifest/image-processing';

/**
 * Directus hook: when a non-webp image is uploaded, convert it to webp and
 * replace the stored file. Delegates the actual conversion to the project's own
 * `image-manifest` library (installed into the container), mirroring how the
 * static-site pipeline worked. Non-image files and already-webp images pass
 * through untouched. Failures are logged but never block the upload.
 *
 * Storage is the local driver, so we read/write the file directly under the
 * uploads root (STORAGE_LOCAL_ROOT, default /directus/uploads).
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
      if (!file || !file.type || !file.type.startsWith('image/')) return;
      if (file.type === 'image/webp') return;

      const srcDisk = file.filename_disk;
      const srcPath = join(UPLOAD_DIR, srcDisk);

      // image-manifest writes <name>.webp next to the original.
      await imageProcessing({ name: srcDisk, path: srcPath, dist: UPLOAD_DIR }, null, null, 'webp');

      const newDisk = srcDisk.replace(/\.[^./\\]+$/, '.webp');
      let size = file.filesize;
      try {
        size = (await stat(join(UPLOAD_DIR, newDisk))).size;
      } catch {
        /* keep previous size if stat fails */
      }
      if (newDisk !== srcDisk) {
        await unlink(srcPath).catch(() => {});
      }
      const newDownload = (file.filename_download || srcDisk).replace(/\.[^./\\]+$/, '.webp');

      await items.updateOne(id, {
        filename_disk: newDisk,
        filename_download: newDownload,
        type: 'image/webp',
        filesize: size,
      });

      logger?.info?.('[convert-to-webp] ' + id + ' -> ' + newDisk);
    } catch (err) {
      logger?.error?.('[convert-to-webp] failed: ' + (err?.message || err));
    }
  });
}
