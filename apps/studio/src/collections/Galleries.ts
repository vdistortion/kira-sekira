import type { CollectionConfig } from 'payload';

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: { singular: 'Галерея', plural: 'Галереи' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название галереи',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Изображения',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Альтернативный текст',
        },
      ],
    },
    {
      name: 'model',
      type: 'relationship',
      relationTo: 'models',
      label: 'Модель (если для поддомена)',
    },
  ],
};
