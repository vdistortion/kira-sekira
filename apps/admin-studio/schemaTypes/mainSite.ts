export default {
  name: 'mainSite',
  title: 'Настройки основного сайта',
  type: 'document',
  fields: [
    {
      name: 'homePage',
      title: 'Главная страница',
      type: 'object',
      fields: [
        { name: 'mainPhoto', title: 'Фото на главной', type: 'image' },
        {
          name: 'advantages',
          title: 'Список преимуществ',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    },
    {
      name: 'projects',
      title: 'Проекты (перетаскивайте для смены порядка)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Название проекта', type: 'string' },
            {
              name: 'slug',
              title: 'URL (slug)',
              type: 'slug',
              options: { source: (doc: any, options: any) => options.parent.title },
            },
            {
              name: 'images',
              title: 'Фотографии',
              type: 'array',
              of: [{ type: 'image' }],
              options: { layout: 'grid' },
            },
          ],
          preview: {
            select: { title: 'title', media: 'images.0.asset' },
          },
        },
      ],
    },
    {
      name: 'prices',
      title: 'Цены',
      type: 'array',
      of: [{ type: 'priceBlock' }], // ТЕПЕРЬ ОН УЗНАЕТ ЭТОТ ТИП
      validation: (Rule: any) => Rule.max(2),
    },
  ],
};
