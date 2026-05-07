import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'kira-sekira',

  projectId: 'cqrff891',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Контент')
          .items([
            // Создаем вкладку "Основной сайт"
            S.listItem().title('Основной сайт').id('mainSiteConfig').child(
              S.document().schemaType('mainSite').documentId('mainSite'), // Фиксированный ID делает документ синглтоном
            ),
            S.divider(),
            // Оставляем остальные типы (например, для поддоменов)
            ...S.documentTypeListItems().filter(
              (item) => !['mainSite', 'homePage', 'pricesPage'].includes(item.getId() as string),
            ),
          ]),
    }),
    visionTool(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
});
