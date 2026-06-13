import { Injectable } from '@angular/core';
import { createDirectus, rest, readItems } from '@directus/sdk';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class DirectusService {
  private baseUrl = environment.apiUrl;

  constructor() {
    this.logModelsAndGalleries();
  }

  private async logModelsAndGalleries(): Promise<void> {
    try {
      const client = createDirectus(this.baseUrl).with(rest());
      const models = await client.request(readItems('models'));
      const galleries = await client.request(readItems('galleries'));
      console.log('✅ [main] Directus connection OK', { models, galleries });
    } catch (err) {
      console.error('❌ [main] Directus connection error', err);
    }
  }

  // Получить модель по поддомену
  async getModelBySubdomain(subdomain: string): Promise<null> {
    return null;
  }

  // Галереи, привязанные к конкретной модели
  async getGalleriesByModel(modelId: number): Promise<string[]> {
    return [];
  }

  /**
   * Все slugs галерей (для prerender).
   */
  async getAllSlugs(): Promise<string[]> {
    return [];
  }

  // Получить одну галерею по slug (для страницы проекта)
  async getGalleryBySlug(slug: string): Promise<null> {
    return null;
  }
}
