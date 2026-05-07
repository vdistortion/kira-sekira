import { Component, inject, OnInit, signal } from '@angular/core';
import { SanityService } from '../../sanity.service';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnInit {
  sanityService = inject(SanityService);
  title = signal('');

  async ngOnInit() {
    const [title] = await this.sanityService.getTitle();
    this.title.set(title);
  }
}
