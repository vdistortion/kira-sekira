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
  collections: [Users, Media, Galleries, Models],
  globals: [MainSite],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: 'en',
  },
  cors: {
    origins: [
      'http://localhost:4200',
      'http://*.localhost:*',
      'https://kira-sekira.ru',
      'https://*.kira-sekira.ru',
    ],
  },
});
