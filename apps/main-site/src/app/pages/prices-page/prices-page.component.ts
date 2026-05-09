import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageComponent } from '../../public/page/page.component';
import { PayloadService } from '../../payload.service';

@Component({
  selector: 'app-prices-page',
  imports: [PageComponent],
  templateUrl: './prices-page.component.html',
  styleUrl: './prices-page.component.scss',
})
export class PricesPageComponent implements OnInit {
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
