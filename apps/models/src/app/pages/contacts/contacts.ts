import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PayloadService } from '../../payload.service';
import { HostService } from '../../host.service';
import { ModelInfo } from '../../features/model-info/model-info';

@Component({
  selector: 'app-contacts',
  imports: [ModelInfo],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacts implements OnInit {
  private payload = inject(PayloadService);
  private hostService = inject(HostService);
  model = signal<any>(null);

  async ngOnInit() {
    const subdomain = this.hostService.getSubdomain();
    const data = await this.payload.getModelBySubdomain(subdomain);
    this.model.set(data);
  }
}
