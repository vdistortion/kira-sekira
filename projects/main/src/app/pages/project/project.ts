import { Component, inject, signal, input, effect } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DirectusService } from 'shared';
import { Page } from '../../layout/page/page';
import { PictureList } from '../../features/gallery/picture-list/picture-list';

@Component({
  selector: 'app-project',
  imports: [Page, PictureList],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  id = input.required<string>();
  private studio = inject(DirectusService);
  private titleService = inject(Title);
  private meta = inject(Meta);

  gallery = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const slug = this.id();
      if (slug) {
        this.loading.set(true);
          this.studio
            .getGalleryBySlug(slug)
            .then((data: any) => {
            this.gallery.set(data);
            this.setSeo(
              data?.title ? `${data.title} — Kira Sekira` : 'Kira Sekira',
              data?.description || 'Фотогалерея Kira Sekira.',
              data?.cover_url || '',
            );
            this.loading.set(false);
          })
          .catch((err) => {
            console.error('Failed to load gallery', err);
            this.error.set('Ошибка загрузки галереи');
            this.loading.set(false);
          });
      }
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
