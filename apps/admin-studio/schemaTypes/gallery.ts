export default {
  name: 'gallery',
  title: 'Галереи',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название папки (например: Свадьбы)',
      type: 'string',
    },
    {
      name: 'images',
      title: 'Фотографии',
      type: 'array',
      of: [{ type: 'image' }],
      options: { layout: 'grid' },
    },
  ],
};
