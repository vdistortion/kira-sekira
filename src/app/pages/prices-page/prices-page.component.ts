import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../../components/page/page/page.component';

@Component({
  selector: 'app-prices-page',
  standalone: true,
  imports: [PageComponent],
  templateUrl: './prices-page.component.html',
  styleUrl: './prices-page.component.scss',
})
export class PricesPageComponent implements OnInit {
  ngOnInit() {
    document.title = 'Стоимость — Kira Sekira';
  }
}
