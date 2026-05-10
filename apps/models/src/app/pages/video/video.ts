import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PayloadService } from '../../payload.service';
import { HostService } from '../../host.service';

@Component({
  selector: 'app-video',
  imports: [],
  templateUrl: './video.html',
  styleUrl: './video.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Video implements OnInit {
  private payload = inject(PayloadService);
  private hostService = inject(HostService);
  videos = signal<Array<{ url: string }>>([]);

  async ngOnInit() {
    const subdomain = this.hostService.getSubdomain();
    const model = await this.payload.getModelBySubdomain(subdomain);
    if (model?.videos) {
      this.videos.set(model.videos);
    }
  }
}
