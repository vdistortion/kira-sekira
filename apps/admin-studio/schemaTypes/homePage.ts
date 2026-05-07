export default {
  name: 'homePage',
  title: 'Главная страница',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Заголовок сайта',
      type: 'string',
      initialValue: 'Твой фотограф Kira Sekira',
    },
    {
      name: 'mainPhoto',
      title: 'Фото на главной странице',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'advantages',
      title: 'Список преимуществ (текст справа)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'projectsName',
      title: 'Заголовок проектов',
      type: 'string',
      initialValue: 'Фотограф в Москве Kira Sekira',
    },
  ],
};
