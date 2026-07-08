import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { marked } from 'marked';
import { DirectusService } from 'shared';
import { Page } from '../../layout/page/page';
import { ProjectList } from '../../features/projects/project-list/project-list';

@Component({
  selector: 'app-home',
  imports: [Page, ProjectList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private titleService = inject(Title);
  private studio = inject(DirectusService);

  aboutImage = signal('');
  aboutText = signal('');
  projectsName = signal('Проекты');

  constructor() {
    this.titleService.setTitle('Kira Sekira');

    this.studio
      .getMainSite()
      .then((data) => {
        this.aboutImage.set(data.main_photo_url || '');
        // Преобразуем markdown в HTML
        const html = data.advantages_md
          ? (marked.parse(data.advantages_md, { async: false }) as string)
          : '';
        this.aboutText.set(html);
      })
      .catch((err) => console.error('Failed to load main site', err));
  }
}
