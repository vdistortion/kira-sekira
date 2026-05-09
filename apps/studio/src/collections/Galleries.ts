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
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
      label: 'Slug (URL)',
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Автогенерация из title, если slug пустой
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-zа-я0-9-]/g, '');
            }
            return value;
          },
        ],
      },
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
