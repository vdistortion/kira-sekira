import { Component, inject, signal, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DirectusService } from 'shared';

@Component({
  selector: 'app-project',
  imports: [RouterLink],
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

  constructor() {
    effect(() => {
      const slug = this.id();
      if (slug) {
        this.studio.getGalleryBySlug(slug).then((data: any) => {
          this.gallery.set(data);
          this.loading.set(false);
          this.setSeo(
            data?.title ? `${data.title} — Kira Sekira` : 'Kira Sekira',
            data?.description || 'Фотогалерея Kira Sekira.',
            data?.cover_url || '',
          );
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
