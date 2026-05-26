import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
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
export class Project implements OnInit {
  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  private payload = inject(PayloadService);
  gallery = signal<{
    title: string;
    images: TypeImage[];
  } | null>(null);
  private pageId$ = this.route.paramMap.pipe(map((params) => params.get('id')));
  public pageId = toSignal(this.pageId$);

  async ngOnInit() {
    const slug = this.pageId();
    if (slug) {
      const data = await this.payload.getGalleryBySlug(slug);
      if (data) {
        this.titleService.setTitle(`${data.title} — Kira Sekira`);
        this.gallery.set(data);
      }
    }
  }
}
