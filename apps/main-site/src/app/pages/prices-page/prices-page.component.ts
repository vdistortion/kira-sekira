import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageComponent } from '../../public/page/page.component';

@Component({
  selector: 'app-prices-page',
  imports: [PageComponent],
  templateUrl: './prices-page.component.html',
  styleUrl: './prices-page.component.scss',
})
export class PricesPageComponent implements OnInit {
  private titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('Стоимость — Kira Sekira');
  }
}
