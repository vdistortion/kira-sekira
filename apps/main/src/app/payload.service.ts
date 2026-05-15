import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

// DTO типы, точно под Payload ответ
export interface PayloadMedia {
  id: number;
  url?: string;
  filename?: string;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: { url?: string };
    medium?: { url?: string };
    gallery?: { url?: string };
  };
}

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

export interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  mainImage: string;
}

export interface GalleryDetail {
  title: string;
  images: Array<{ url: string; metadata: { width: number; height: number } }>;
}

@Injectable({ providedIn: 'root' })
export class PayloadService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Главные настройки сайта.
   * depth=2 чтобы получить полные объекты media вместо ID.
   */
  async getGlobal(): Promise<MainSiteGlobal> {
    try {
      return await firstValueFrom(
        this.http.get<MainSiteGlobal>(`${this.baseUrl}/globals/mainSite`, {
          params: { depth: '2' },
        }),
      );
    } catch (err) {
      console.error('Failed to fetch mainSite global:', err);
      // Fallback: пустой объект, чтобы не сломать компоненты
      return { id: 0 };
    }
  }

  /**
   * Список галерей для основного сайта (без привязки к модели).
   */
  async getGalleriesList(): Promise<GalleryItem[]> {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.baseUrl}/galleries`, {
          params: {
            'where[model][exists]': 'false',
            depth: '1', // нужен depth=1 чтобы получить image объект
          },
        }),
      );
      return res.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        mainImage: doc.images?.[0]?.image?.url || '',
      }));
    } catch (err) {
      console.error('Failed to fetch galleries list:', err);
      return [];
    }
  }

  /**
   * Все slugs галерей (для prerender).
   */
  async getAllSlugs(): Promise<string[]> {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.baseUrl}/galleries`, {
          params: {
            'where[model][exists]': 'false',
            select: 'slug',
            limit: '1000',
          },
        }),
      );
      return res.docs.map((doc: any) => doc.slug);
    } catch (err) {
      console.error('Failed to fetch slugs:', err);
      return [];
    }
  }

  /**
   * Детальная галерея по slug.
   */
  async getGalleryBySlug(slug: string): Promise<GalleryDetail | null> {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.baseUrl}/galleries`, {
          params: {
            'where[slug][equals]': slug,
            depth: '2',
          },
        }),
      );
      const doc = res.docs[0];
      if (!doc) return null;
      return {
        title: doc.title,
        images:
          doc.images?.map((img: any) => ({
            url: img.image.url,
            metadata: {
              width: img.image.width || 0,
              height: img.image.height || 0,
            },
          })) || [],
      };
    } catch (err) {
      console.error('Failed to fetch gallery by slug:', err);
      return null;
    }
  }
}
