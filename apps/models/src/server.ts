import { join } from 'node:path';
import { createSsrServer } from '@kira-sekira/shared/server';

const browserDistFolder = join(import.meta.dirname, '../browser');

const { reqHandler } = createSsrServer({
  browserDistFolder,
  defaultPort: 4201,
  importMetaUrl: import.meta.url,
});

export { reqHandler };
