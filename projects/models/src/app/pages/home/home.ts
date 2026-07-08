import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marked } from 'marked';
import { DirectusService, YoutubeEmbedPipe } from 'shared';
import { HostService } from '../../host.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, YoutubeEmbedPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private studio = inject(DirectusService);
  private host = inject(HostService);

  model = signal<any>(null);
  galleries = signal<any[]>([]);
  aboutHtml = signal('');

  constructor() {
    const subdomain = this.host.getSubdomain();
    this.studio
      .getModelBySubdomain(subdomain)
      .then((data) => {
        this.model.set(data);
        this.galleries.set(data.galleries || []);
        // Преобразуем markdown-описание в HTML
        const html = data.description
          ? (marked.parse(data.description, { async: false }) as string)
          : '';
        this.aboutHtml.set(html);
      })
      .catch((err) => console.error('Failed to load model', err));
  }
}
