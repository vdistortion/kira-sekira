import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

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

export interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  mainImage: string;
}

export interface GalleryDetail {
  id: number;
  title: string;
  images: Array<{ url: string; width: number; height: number }>;
}

@Injectable({ providedIn: 'root' })
export class PayloadService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Получить модель по поддомену
  async getModelBySubdomain(subdomain: string): Promise<ModelData | null> {
    const res: any = await firstValueFrom(
      this.http.get(`${this.baseUrl}/models`, {
        params: {
          'where[subdomain][equals]': subdomain,
          depth: '2',
        },
      }),
    );
    const doc = res.docs[0];
    if (!doc) return null;
    return {
      id: doc.id,
      fullName: doc.fullName,
      mainPhoto: doc.mainPhoto,
      parameters: doc.parameters,
      about: doc.about,
      contacts: doc.contacts,
      videos: doc.videos,
    };
  }

  // Галереи, привязанные к конкретной модели
  async getGalleriesByModel(modelId: number): Promise<GalleryItem[]> {
    const res: any = await firstValueFrom(
      this.http.get(`${this.baseUrl}/galleries`, {
        params: {
          'where[model][equals]': modelId.toString(),
          depth: '0',
        },
      }),
    );
    return res.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      mainImage: doc.images?.[0]?.image?.url || '',
    }));
  }

  // Получить одну галерею по slug (для страницы проекта)
  async getGalleryBySlug(slug: string): Promise<GalleryDetail | null> {
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
      id: doc.id,
      title: doc.title,
      images:
        doc.images?.map((img: any) => ({
          url: img.image.url,
          width: img.image.width || 0,
          height: img.image.height || 0,
        })) || [],
    };
  }
}
