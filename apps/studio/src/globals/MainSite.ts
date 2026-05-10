import type { GlobalConfig } from 'payload';

export const MainSite: GlobalConfig = {
  slug: 'mainSite',
  access: {
    read: () => true,
  },
  label: 'Настройки главного сайта',
  fields: [
    {
      name: 'aboutPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Фото на главной',
    },
    {
      name: 'aboutText',
      type: 'richText',
      label: 'Текст о фотографе',
    },
    {
      name: 'prices',
      type: 'array',
      label: 'Услуги и цены',
      fields: [
        { name: 'title', type: 'text', label: 'Название' },
        { name: 'price', type: 'text', label: 'Цена' },
        { name: 'description', type: 'richText', label: 'Описание' },
        { name: 'photo', type: 'upload', relationTo: 'media', label: 'Фото' },
      ],
    },
    {
      name: 'contacts',
      type: 'group',
      label: 'Контакты',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'telegram', type: 'text' },
        { name: 'whatsapp', type: 'text' },
      ],
    },
  ],
};
