import { Component, inject, OnInit, signal } from '@angular/core';
import { PayloadService } from '../../payload.service';
import { HostService } from '../../host.service';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage implements OnInit {
  private payload = inject(PayloadService);
  private hostService = inject(HostService);
  model = signal<any>(null);

  async ngOnInit() {
    const subdomain = this.hostService.getSubdomain();
    const data = await this.payload.getModelBySubdomain(subdomain);
    this.model.set(data);
  }
}
