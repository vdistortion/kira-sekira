import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { ru } from '@payloadcms/translations/languages/ru';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Galleries } from './collections/Galleries';
import { Models } from './collections/Models';
import { MainSite } from './globals/MainSite';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const PG_PASSWORD = encodeURIComponent(process.env.POSTGRES_PASSWORD || '');
const PG_HOST = process.env.POSTGRES_HOST || 'db';
const PG_PORT = process.env.POSTGRES_PORT || '5432';

const connectionString = `postgres://postgres:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/studio`;

const getAllowedOrigins = (): string[] => {
  const envOrigins = process.env.ALLOWED_ORIGINS || '';
  const origins = envOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  console.log('[PAYLOAD] Allowed origins:', origins);
  return origins;
};

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  routes: {
    admin: '/',
  },
  serverURL: process.env.SERVER_URL || 'http://studio.localhost:3000',
  collections: [Users, Media, Galleries, Models],
  globals: [MainSite],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || connectionString,
    },
  }),
  sharp,
  plugins: [],
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: 'en',
  },
  cors: {
    origins: getAllowedOrigins(),
  },
});
