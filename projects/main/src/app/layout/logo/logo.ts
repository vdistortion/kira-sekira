import { Component, inject, signal } from '@angular/core';
import { DirectusService } from 'shared';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class Logo {
  private studio = inject(DirectusService);
  name = signal('');

  constructor() {
    this.studio
      .getMainSite()
      .then((site) => {
        this.name.set(site.site_name || '');
      })
      .catch((err) => console.error('Failed to load site identity', err));
  }
}
