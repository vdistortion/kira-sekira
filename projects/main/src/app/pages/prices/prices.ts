import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DirectusService, type PriceItem } from 'shared';
import { Page } from '../../layout/page/page';

@Component({
  selector: 'app-prices',
  imports: [Page],
  templateUrl: './prices.html',
  styleUrl: './prices.scss',
})
export class Prices {
  private titleService = inject(Title);
  private studio = inject(DirectusService);

  prices = signal<PriceItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.titleService.setTitle('Стоимость — Kira Sekira');

    this.studio
      .getPrices()
      .then((data) => {
        this.prices.set(data);
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('Failed to load prices', err);
        this.error.set('Ошибка загрузки цен');
        this.loading.set(false);
      });
  }
}
