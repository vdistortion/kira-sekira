import { Component, inject, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private studio = inject(DirectusService);

  gallery = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const slug = this.route.snapshot.paramMap.get('id');
      if (slug) {
        this.loading.set(true);
        this.studio
          .getGalleryBySlug(slug)
          .then((data) => {
            this.gallery.set(data);
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
}
