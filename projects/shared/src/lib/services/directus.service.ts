import { Injectable, Inject } from '@angular/core';
import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';
import { DIRECTUS_API_URL } from './api-url.token';
import {
  MainSite,
  Contacts,
  PriceItem,
  Model,
  Gallery,
  DirectusFile,
} from '../types/directus-types';

@Injectable({
  providedIn: 'root', // будет доступен, если модуль предоставит токен
})
export class DirectusService {
  private client;

  constructor(@Inject(DIRECTUS_API_URL) private apiUrl: string) {
    this.client = createDirectus(this.apiUrl).with(rest());
  }

  /** Формирует полный URL файла из объекта Directus */
  getFileUrl(file: DirectusFile): string {
    return `${this.apiUrl}/assets/${file.id}/${file.filename_download}`;
  }

  /** Получить настройки главного сайта */
  async getMainSite(): Promise<MainSite> {
    const data = (await this.client.request(
      readSingleton('main_site', {
        fields: ['*', 'main_photo.*', 'logo.*', 'galleries.*', 'galleries.cover.*'],
      }),
    )) as MainSite;

    return {
      ...data,
      main_photo_url: data.main_photo ? this.getFileUrl(data.main_photo) : '',
      logo_url: data.logo ? this.getFileUrl(data.logo) : '',
      galleries: (data.galleries || []).map((g: Gallery) => ({
        ...g,
        cover_url: g.cover ? this.getFileUrl(g.cover) : '',
      })),
    };
  }

  /** Получить общие контакты */
  async getContacts(): Promise<Contacts> {
    return this.client.request(readSingleton('contacts')) as Promise<Contacts>;
  }

  /** Получить список услуг */
  async getPrices(): Promise<PriceItem[]> {
    const items = (await this.client.request(
      readItems('prices', {
        fields: ['*', 'image.*'],
        sort: ['sort'],
      }),
    )) as PriceItem[];

    return items.map((item) => ({
      ...item,
      image_url: item.image ? this.getFileUrl(item.image) : '',
    }));
  }

  /** Получить галереи, привязанные к главному сайту */
  async getMainGalleries(): Promise<Gallery[]> {
    const main = (await this.client.request(
      readSingleton('main_site', {
        fields: ['galleries.*', 'galleries.cover.*'],
      }),
    )) as { galleries: Gallery[] };

    return (main.galleries || []).map((g: Gallery) => ({
      ...g,
      cover_url: g.cover ? this.getFileUrl(g.cover) : '',
    }));
  }

  /** Получить модель по поддомену */
  async getModelBySubdomain(subdomain: string): Promise<Model> {
    const items = (await this.client.request(
      readItems('models', {
        filter: { subdomain: { _eq: subdomain } },
        fields: ['*', 'main_photo.*', 'galleries.*', 'galleries.cover.*'],
      }),
    )) as Model[];

    if (!items.length) {
      throw new Error(`Модель с поддоменом "${subdomain}" не найдена`);
    }

    const model = items[0];
    return {
      ...model,
      main_photo_url: model.main_photo ? this.getFileUrl(model.main_photo) : '',
      galleries: (model.galleries || []).map((g: Gallery) => ({
        ...g,
        cover_url: g.cover ? this.getFileUrl(g.cover) : '',
      })),
    };
  }

  /** Детальная галерея по slug */
  async getGalleryBySlug(slug: string): Promise<Gallery | null> {
    const items = (await this.client.request(
      readItems('galleries', {
        filter: { slug: { _eq: slug } },
        fields: ['*', 'images.*', 'images.image.*'],
      }),
    )) as any[];

    if (!items.length) return null;
    const g = items[0];
    return {
      ...g,
      cover_url: g.cover ? this.getFileUrl(g.cover) : '',
      images: (g.images || []).map((img: any) => ({
        ...img,
        url: img.image ? this.getFileUrl(img.image) : '',
      })),
    };
  }

  /** Все slug'и галерей для главного сайта (SSG) */
  async getAllMainSlugs(): Promise<string[]> {
    const main = (await this.client.request(
      readSingleton('main_site', {
        fields: ['galleries.slug'],
      }),
    )) as { galleries: Gallery[] };
    return (main.galleries || []).map((g) => g.slug);
  }

  /** Все slug'и галерей всех моделей (SSG) */
  async getAllModelsSlugs(): Promise<string[]> {
    const models = (await this.client.request(
      readItems('models', {
        fields: ['galleries.slug'],
      }),
    )) as Model[];

    const slugs: string[] = [];
    for (const m of models) {
      for (const g of m.galleries || []) {
        slugs.push(g.slug);
      }
    }
    return slugs;
  }
}
