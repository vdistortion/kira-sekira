import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createDirectus, rest, readItems } from '@directus/sdk';
import type { GalleryItem, GalleryDetail } from '@kira-sekira/shared';
import { environment } from '../environments/environment';

const client = createDirectus(environment.apiUrl).with(rest());

const models = await client.request(readItems('models'));
const galleries = await client.request(readItems('galleries'));
console.log({ galleries, models });

export interface ModelData {
  id: number;
  fullName: string;
  mainPhoto?: { url: string };
  parameters?: {
    height?: number;
    weight?: number;
    chest?: number;
    waist?: number;
    hips?: number;
  };
  about?: any; // rich text
  contacts?: {
    phone?: string;
    telegram?: string;
    whatsapp?: string;
    email?: string;
  };
  videos?: Array<{ url: string }>;
}

@Injectable({ providedIn: 'root' })
export class DirectusService {
  // Получить модель по поддомену
  async getModelBySubdomain(subdomain: string): Promise<ModelData | null> {
    return null;
  }

  // Галереи, привязанные к конкретной модели
  async getGalleriesByModel(modelId: number): Promise<GalleryItem[]> {
    return [];
  }

  /**
   * Все slugs галерей (для prerender).
   */
  async getAllSlugs(): Promise<string[]> {
    return [];
  }

  // Получить одну галерею по slug (для страницы проекта)
  async getGalleryBySlug(slug: string): Promise<GalleryDetail | null> {
    return null;
  }
}
