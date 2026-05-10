import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
export class Portfolio implements OnInit {
  private payload = inject(PayloadService);
  private hostService = inject(HostService);
  galleries = signal<any[]>([]);
  model = signal<any>(null);

  async ngOnInit() {
    const subdomain = this.hostService.getSubdomain();
    const model = await this.payload.getModelBySubdomain(subdomain);
    if (model) {
      this.model.set(model);
      const galleries = await this.payload.getGalleriesByModel(model.id);
      this.galleries.set(galleries);
    }
  }
}
