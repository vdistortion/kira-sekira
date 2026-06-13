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

  /**
   * Главные настройки сайта.
   * depth=2 чтобы получить полные объекты media вместо ID.
   */
  async getGlobal(): Promise<{ id: number }> {
    return { id: 0 };
  }

  /**
   * Список галерей для основного сайта (без привязки к модели).
   */
  async getGalleriesList(): Promise<string[]> {
    return [];
  }

  /**
   * Все slugs галерей (для prerender).
   */
  async getAllSlugs(): Promise<string[]> {
    return [];
  }

  /**
   * Детальная галерея по slug.
   */
  async getGalleryBySlug(slug: string): Promise<null> {
    return null;
  }
}
