import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { PayloadService } from '../../payload.service';
import { HostService } from '../../host.service';

@Component({
  selector: 'app-video',
  imports: [],
  templateUrl: './video.html',
  styleUrl: './video.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Video {
  private payload = inject(PayloadService);
  private hostService = inject(HostService);
  videos = signal<Array<{ url: string }>>([]);

  constructor() {
    effect(() => {
      const subdomain = this.hostService.getSubdomain();
      this.payload.getModelBySubdomain(subdomain).then((model) => {
        if (model?.videos) {
          this.videos.set(model.videos);
        }
      });
    });
  }
}
