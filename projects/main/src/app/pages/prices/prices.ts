import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Page } from '../../layout/page/page';

interface PriceItem {
  id: string;
  title?: string;
  price?: string;
  description?: string; // HTML
  details?: string;
  image?: string;
}

@Component({
  selector: 'app-prices',
  imports: [Page],
  templateUrl: './prices.html',
  styleUrl: './prices.scss',
})
export class Prices {
  private titleService = inject(Title);
  prices = signal<PriceItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.titleService.setTitle('Стоимость — Kira Sekira');
  }
}
