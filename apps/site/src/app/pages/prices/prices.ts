import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Page } from '../../layout/page/page';
import { PayloadService } from '../../payload.service';
import { lexicalToHtml } from '@kira-sekira/shared';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Prices implements OnInit {
  private titleService = inject(Title);
  private payload = inject(PayloadService);
  prices = signal<PriceItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.titleService.setTitle('Стоимость — Kira Sekira');
    this.loading.set(true);
    this.error.set(null);

    try {
      const global = await this.payload.getGlobal();
      if (global.prices?.length) {
        const mapped = global.prices.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          description: p.description ? lexicalToHtml(p.description) : undefined,
          details: p.details,
          image: p.photo?.sizes?.medium?.url || p.photo?.url,
        }));
        this.prices.set(mapped);
      }
    } catch (err) {
      console.error('Error loading prices:', err);
      this.error.set('Ошибка загрузки данных');
    } finally {
      this.loading.set(false);
    }
  }
}
