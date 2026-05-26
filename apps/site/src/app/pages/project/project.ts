import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Page } from '../../layout/page/page';
import { PictureList } from '../../features/gallery/picture-list/picture-list';
import { PayloadService } from '../../payload.service';
import type { TypeImage } from '@kira-sekira/shared';

@Component({
  selector: 'app-project',
  imports: [Page, PictureList],
  templateUrl: './project.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Project {
  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  private payload = inject(PayloadService);
  gallery = signal<{
    title: string;
    images: TypeImage[];
  } | null>(null);

  constructor() {
    effect(() => {
      const slug = this.route.snapshot.paramMap.get('id');
      if (slug) {
        this.payload.getGalleryBySlug(slug).then((data) => {
          if (data) {
            this.titleService.setTitle(`${data.title} — Kira Sekira`);
            this.gallery.set(data);
          }
        });
      }
    });
  }
}
