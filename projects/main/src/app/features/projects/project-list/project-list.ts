import { Component, inject, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCard } from '../project-card/project-card';
import { DirectusService } from '../../../directus.service';

@Component({
  selector: 'app-project-list',
  imports: [ProjectCard, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  private studio = inject(DirectusService);
  galleries = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.error.set(null);

      this.studio
        .getGalleriesList()
        .then((data) => {
          this.galleries.set(data);
        })
        .catch((err) => {
          console.error('Error loading galleries:', err);
          this.error.set('Ошибка загрузки проектов');
        })
        .finally(() => {
          this.loading.set(false);
        });
    });
  }
}
