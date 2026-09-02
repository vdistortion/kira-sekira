import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { DirectusService, MarkdownPipe, YoutubeEmbedPipe } from 'shared';
import { HostService } from '../../host.service';
import { ModelStore } from '../../model.store';

@Component({
  selector: 'app-home',
  imports: [MarkdownPipe, RouterLink, YoutubeEmbedPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private studio = inject(DirectusService);
  private host = inject(HostService);
  private modelStore = inject(ModelStore);
  private platformId = inject(PLATFORM_ID);
  private titleService = inject(Title);
  private meta = inject(Meta);

  model = signal<any>(null);
  galleries = signal<any[]>([]);
  aboutMarkdown = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    // SSG: the server renders a loading shell, and the real model is resolved
    // on the client from the actual hostname. This lets a single build serve
    // every subdomain correctly without per-request SSR.
    if (isPlatformBrowser(this.platformId)) {
      this.load(this.host.getSubdomain());
    }
  }

  private load(subdomain: string): void {
    Promise.all([
      this.studio.getModelBySubdomain(subdomain),
      this.studio.getContacts(),
    ])
      .then(([model, contacts]) => {
        this.modelStore.name.set(model.name || '');
        this.model.set({
          fullName: model.name,
          mainPhoto: model.main_photo_url ? { url: model.main_photo_url } : undefined,
          parameters: {
            height: model.height,
            weight: model.weight,
            chest: model.bust,
            waist: model.waist,
            hips: model.hips,
            clothingSize: model.clothing_size,
            shoeSize: model.shoe_size,
            hairColor: model.hair_color,
            eyeColor: model.eye_color,
          },
          contacts,
          videos: model.videos || [],
        });
        this.aboutMarkdown.set(model.description || '');
        this.galleries.set(
          (model.galleries || []).map((g: any) => ({
            slug: g.slug,
            title: g.title,
            mainImage: g.cover_url || '',
          })),
        );
        this.setSeo(
          model.name ? `${model.name} — Kira Sekira` : 'Kira Sekira',
          model.description || 'Фотомодель Kira Sekira.',
          model.main_photo_url || '',
        );
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('Failed to load model', err);
        this.error.set('Ошибка загрузки данных модели');
        this.loading.set(false);
      });
  }

  private setSeo(title: string, description: string, image?: string) {
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }
  }
}
