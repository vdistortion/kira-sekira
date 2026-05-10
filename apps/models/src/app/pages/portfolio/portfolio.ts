import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PayloadService } from '../../payload.service';

@Component({
  selector: 'app-portfolio',
  imports: [],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio implements OnInit {
  private payload = inject(PayloadService);
  galleries = signal<any[]>([]);
  subdomain = 'yana-katunova';

  async ngOnInit() {
    const model = await this.payload.getModelBySubdomain(this.subdomain);
    if (model) {
      const galleries = await this.payload.getGalleriesByModel(model.id);
      this.galleries.set(galleries);
    }
  }
}
