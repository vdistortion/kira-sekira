import { Component, inject, OnInit, signal } from '@angular/core';
import { SanityService } from '../../sanity.service';

@Component({
  selector: 'app-portfolio-page',
  imports: [],
  templateUrl: './portfolio-page.html',
  styleUrl: './portfolio-page.scss',
})
export class PortfolioPage implements OnInit {
  sanityService = inject(SanityService);
  galleries = signal<any[]>([]);

  async ngOnInit() {
    const data = await this.sanityService.getGalleries();
    this.galleries.set(data);
  }
}
