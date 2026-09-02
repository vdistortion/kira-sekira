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
  title = signal('');

  constructor() {
    this.studio
      .getSiteName()
      .then((name) => this.title.set(name))
      .catch((err) => console.error('Failed to load site name', err));
  }
}
