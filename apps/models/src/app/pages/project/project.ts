import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PayloadService } from '../../payload.service';

@Component({
  selector: 'app-project',
  imports: [],
  templateUrl: './project.html',
  styleUrl: './project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Project {
  private route = inject(ActivatedRoute);
  private payload = inject(PayloadService);
  gallery = signal<any>(null);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('id');
    if (slug) {
      this.payload.getGalleryBySlug(slug).then((data) => {
        this.gallery.set(data);
      });
    }
  }
}
