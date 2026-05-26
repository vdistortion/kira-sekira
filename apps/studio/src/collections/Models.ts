import type { CollectionConfig } from 'payload';
import slugify from 'slugify';

export const Models: CollectionConfig = {
  slug: 'models',
  access: {
    read: () => true,
  },
  labels: { singular: 'Модель', plural: 'Модели' },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Полное имя',
    },
    {
      name: 'subdomain',
      type: 'text',
      required: true,
      unique: true,
      label: 'Поддомен',
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.fullName) {
              return slugify(data.fullName, {
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
      name: 'mainPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Главное фото',
    },
    {
      name: 'parameters',
      type: 'group',
      label: 'Параметры',
      fields: [
        { name: 'height', type: 'number', label: 'Рост (см)' },
        { name: 'weight', type: 'number', label: 'Вес (кг)' },
        { name: 'chest', type: 'number', label: 'Грудь' },
        { name: 'waist', type: 'number', label: 'Талия' },
        { name: 'hips', type: 'number', label: 'Бёдра' },
      ],
    },
    {
      name: 'about',
      type: 'richText',
      label: 'О себе',
    },
    {
      name: 'contacts',
      type: 'group',
      label: 'Контакты',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'telegram', type: 'text' },
        { name: 'whatsapp', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      label: 'Видео',
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'YouTube/Vimeo URL',
        },
      ],
    },
  ],
};
