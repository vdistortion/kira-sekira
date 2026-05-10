import type { CollectionConfig } from 'payload';
import slugify from 'slugify';

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  access: {
    read: () => true,
  },
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
      admin: { position: 'sidebar' },
      label: 'Slug (URL)',
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return slugify(data.title, {
                lower: true,
                strict: true,
                locale: 'ru',
              });
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
