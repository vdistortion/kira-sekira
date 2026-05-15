import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  labels: { singular: 'Файл', plural: 'Файлы' },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Описание (alt)',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Категория',
      options: [
        { label: 'Галереи', value: 'gallery' },
        { label: 'Главная страница', value: 'main' },
        { label: 'Профили моделей', value: 'models' },
        { label: 'Прочее', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    formatOptions: {
      format: 'webp',
      options: {
        quality: 85,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 200,
        fit: 'cover',
      },
      {
        name: 'medium',
        width: 600,
        height: 400,
        fit: 'inside',
      },
      {
        name: 'gallery',
        width: 1000,
        fit: 'inside',
      },
    ],
  },
};
