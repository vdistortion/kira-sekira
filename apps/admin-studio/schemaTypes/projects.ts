export default {
  name: 'projects',
  title: 'Проекты',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название проекта',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-адрес (генерируется из названия)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'siteType',
      title: 'Где отображать?',
      type: 'string',
      options: {
        list: [
          { title: 'Основной сайт', value: 'main' },
          { title: 'Поддомены моделей', value: 'subdomain' },
        ],
        layout: 'radio',
      },
      initialValue: 'main',
    },
    {
      name: 'images',
      title: 'Фотографии',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      options: { layout: 'grid' },
    },
  ],
};
