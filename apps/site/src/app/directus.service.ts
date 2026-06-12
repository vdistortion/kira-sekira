import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createDirectus, rest, readItems } from '@directus/sdk';
import { environment } from '../environments/environment';
import type { PayloadMedia, GalleryItem, GalleryDetail } from '@kira-sekira/shared';

const client = createDirectus(environment.apiUrl).with(rest());

const models = await client.request(readItems('models'));
const galleries = await client.request(readItems('galleries'));
console.log({ galleries, models });

export interface MainSiteGlobal {
  id: number;
  aboutPhoto?: PayloadMedia | null;
  aboutText?: any;
  prices?: Array<{
    id: string;
    title?: string;
    price?: string;
    description?: any; // richText
    details?: string;
    photo?: PayloadMedia | null;
  }>;
  contacts?: {
    phone?: string | null;
    telegram?: string | null;
    whatsapp?: string | null;
  };
}

@Injectable({ providedIn: 'root' })
export class DirectusService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Главные настройки сайта.
   * depth=2 чтобы получить полные объекты media вместо ID.
   */
  async getGlobal(): Promise<MainSiteGlobal> {
    return { id: 0 };
  }

  /**
   * Список галерей для основного сайта (без привязки к модели).
   */
  async getGalleriesList(): Promise<GalleryItem[]> {
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
  async getGalleryBySlug(slug: string): Promise<GalleryDetail | null> {
    return null;
  }
}
