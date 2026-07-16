import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DirectusService, MarkdownPipe } from 'shared';
import { Page } from '../../layout/page/page';
import { ProjectList } from '../../features/projects/project-list/project-list';

@Component({
  selector: 'app-home',
  imports: [MarkdownPipe, Page, ProjectList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private titleService = inject(Title);
  private studio = inject(DirectusService);

  aboutImage = signal('');
  aboutMarkdown = signal('');
  galleries = signal<any[]>([]);
  projectsName = signal('Проекты');
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.titleService.setTitle('Kira Sekira');

    this.studio
      .getMainSite()
      .then((data) => {
        this.aboutImage.set(data.main_photo_url || '');
        this.aboutMarkdown.set(data.advantages_md || '');
        this.galleries.set(data.galleries || []);
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('Failed to load main site', err);
        this.error.set('Ошибка загрузки данных');
        this.loading.set(false);
      });
  }
}
