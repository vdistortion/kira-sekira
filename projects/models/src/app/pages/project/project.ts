import { Component, inject, signal, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
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

  gallery = signal<any>(null);
  loading = signal(true);

  constructor() {
    effect(() => {
      const slug = this.id();
      if (slug) {
        this.studio.getGalleryBySlug(slug).then((data) => {
          this.gallery.set(data);
          this.loading.set(false);
          if (data?.title) {
            this.titleService.setTitle(data.title);
          }
        });
      }
    });
  }
}
