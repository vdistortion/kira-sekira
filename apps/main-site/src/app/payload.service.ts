import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export interface MainSiteGlobal {
  aboutPhoto?: { url: string; alt?: string };
  aboutText?: any; // rich text
  prices?: Array<{
    title?: string;
    price?: string;
    description?: any;
    photo?: { url: string };
  }>;
  contacts?: {
    phone?: string;
    telegram?: string;
    whatsapp?: string;
  };
}

export interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  mainImage: string; // url первой картинки
  images?: Array<{
    image: { url: string; width?: number; height?: number };
    alt?: string;
  }>;
}

export interface GalleryDetail {
  title: string;
  images: Array<{ url: string; metadata: { width: number; height: number } }>;
}

@Injectable({ providedIn: 'root' })
export class PayloadService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Главные настройки
  async getGlobal(): Promise<MainSiteGlobal> {
    return firstValueFrom(this.http.get<MainSiteGlobal>(`${this.baseUrl}/globals/mainSite`));
  }

  // Список галерей для основного сайта (без привязки к модели)
  async getGalleriesList(): Promise<GalleryItem[]> {
    const res: any = await firstValueFrom(
      this.http.get(`${this.baseUrl}/galleries`, {
        params: {
          'where[model][exists]': 'false',
          depth: '0', // не тянуть вложенные объекты
        },
      }),
    );
    // Преобразуем к нужному формату
    return res.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      mainImage: doc.images?.[0]?.image?.url || '',
    }));
  }

  // Все slugs галерей (для prerender)
  async getAllSlugs(): Promise<string[]> {
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
  }

  // Детальная галерея по slug
  async getGalleryBySlug(slug: string): Promise<GalleryDetail | null> {
    const res: any = await firstValueFrom(
      this.http.get(`${this.baseUrl}/galleries`, {
        params: {
          'where[slug][equals]': slug,
          depth: '2', // чтобы получить url изображений
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
  }
}
