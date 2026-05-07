export default {
  name: 'priceBlock',
  title: 'Блок цены',
  type: 'object',
  fields: [
    { name: 'title', title: 'Заголовок', type: 'string' },
    { name: 'price', title: 'Цена', type: 'string' },
    { name: 'photo', title: 'Фото', type: 'image', options: { hotspot: true } },
    { name: 'list', title: 'Услуги (список)', type: 'array', of: [{ type: 'string' }] },
    { name: 'description', title: 'Описание', type: 'array', of: [{ type: 'block' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'price', media: 'photo' },
  },
};
