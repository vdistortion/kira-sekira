import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { lexicalToHtml } from '@kira-sekira/shared';
import { ModelInfo } from '../../features/model-info/model-info';
import { PayloadService } from '../../payload.service';
import { HostService } from '../../host.service';

@Component({
  selector: 'app-home',
  imports: [ModelInfo],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private payload = inject(PayloadService);
  private hostService = inject(HostService);
  model = signal<any>(null);
  aboutHtml = signal('');

  constructor() {
    effect(() => {
      const subdomain = this.hostService.getSubdomain();
      this.payload.getModelBySubdomain(subdomain).then((data) => {
        this.model.set(data);
        if (data?.about) {
          this.aboutHtml.set(lexicalToHtml(data.about));
        }
      });
    });
  }
}
