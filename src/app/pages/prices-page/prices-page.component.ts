import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PageComponent } from '../../components/page/page/page.component';

@Component({
  selector: 'app-prices-page',
  standalone: true,
  imports: [PageComponent, NgOptimizedImage],
  templateUrl: './prices-page.component.html',
  styleUrl: './prices-page.component.scss',
})
export class PricesPageComponent implements OnInit {
  ngOnInit() {
    document.title = 'Стоимость — Kira Sekira';
  }
}
