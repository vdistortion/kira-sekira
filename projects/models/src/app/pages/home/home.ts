import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DirectusService, MarkdownPipe, YoutubeEmbedPipe } from 'shared';
import { HostService } from '../../host.service';

@Component({
  selector: 'app-home',
  imports: [MarkdownPipe, RouterLink, YoutubeEmbedPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private studio = inject(DirectusService);
  private host = inject(HostService);

  model = signal<any>(null);
  galleries = signal<any[]>([]);
  aboutMarkdown = signal('');

  constructor() {
    const subdomain = this.host.getSubdomain();
    this.studio
      .getModelBySubdomain(subdomain)
      .then((data) => {
        this.model.set(data);
        this.galleries.set(data.galleries || []);
        this.aboutMarkdown.set(data.description || '');
      })
      .catch((err) => console.error('Failed to load model', err));
  }
}
