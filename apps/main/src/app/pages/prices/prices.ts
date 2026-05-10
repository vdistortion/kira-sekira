import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Page } from '../../layout/page/page';
import { PayloadService } from '../../payload.service';

@Component({
  selector: 'app-prices',
  imports: [Page],
  templateUrl: './prices.html',
  styleUrl: './prices.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Prices implements OnInit {
  private titleService = inject(Title);
  private payload = inject(PayloadService);
  prices = signal<any[]>([]);

  async ngOnInit() {
    this.titleService.setTitle('Стоимость — Kira Sekira');
    const global = await this.payload.getGlobal();
    if (global.prices) {
      this.prices.set(global.prices);
    }
  }
}
