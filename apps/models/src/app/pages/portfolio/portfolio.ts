import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModelInfo } from '../../features/model-info/model-info';
import { PayloadService } from '../../payload.service';
import { HostService } from '../../host.service';

@Component({
  selector: 'app-portfolio',
  imports: [ModelInfo, RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  private payload = inject(PayloadService);
  private hostService = inject(HostService);
  galleries = signal<any[]>([]);
  model = signal<any>(null);

  constructor() {
    effect(async () => {
      const subdomain = this.hostService.getSubdomain();
      const modelData = await this.payload.getModelBySubdomain(subdomain);
      if (modelData) {
        this.model.set(modelData);
        const galleriesData = await this.payload.getGalleriesByModel(modelData.id);
        this.galleries.set(galleriesData);
      }
    });
  }
}
