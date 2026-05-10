import type { CollectionConfig } from 'payload';
import slugify from 'slugify';

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  access: {
    read: () => true,
  },
  labels: { singular: 'Галерея', plural: 'Галереи' },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (data?.images) {
          for (const img of data.images) {
            // Если alt не задан, берём имя файла из медиа
            if (img.image && !img.alt) {
              // Случай, когда image – это ID (число)
              if (typeof img.image === 'number') {
                const media = await req.payload.findByID({
                  collection: 'media',
                  id: img.image,
                });
                if (media?.filename) {
                  // Удаляем расширение файла
                  console.log(media.filename);
                  img.alt = media.filename.replace(/\.[^/.]+$/, '');
                }
              }
              // Случай, когда image уже развёрнут в объект (например, при дублировании)
              else if (typeof img.image === 'object' && img.image.filename) {
                img.alt = img.image.filename.replace(/\.[^/.]+$/, '');
              }
            }
          }
        }
      },
    ],
  },
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
          hasMany: true,
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
