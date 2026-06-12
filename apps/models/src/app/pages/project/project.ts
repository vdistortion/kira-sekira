import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DirectusService } from '../../directus.service';

@Component({
  selector: 'app-project',
  imports: [RouterLink],
  templateUrl: './project.html',
  styleUrl: './project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Project {
  private route = inject(ActivatedRoute);
  private payload = inject(DirectusService);

  gallery = signal<any>(null);
  loading = signal(true);

  constructor() {
    effect(() => {
      const slug = this.route.snapshot.paramMap.get('id');
      if (slug) {
        this.payload.getGalleryBySlug(slug).then((data) => {
          this.gallery.set(data);
          this.loading.set(false);
        });
      }
    });
  }
}
