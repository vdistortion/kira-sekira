import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Page } from '../../layout/page/page';
import { ProjectList } from '../../features/projects/project-list/project-list';
import { PayloadService } from '../../payload.service';
import { lexicalToHtml } from '@kira-sekira/shared';

@Component({
  selector: 'app-home',
  imports: [Page, ProjectList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private titleService = inject(Title);
  private payload = inject(PayloadService);
  aboutImage = signal('');
  aboutText = signal('');
  projectsName = signal('Проекты');

  constructor() {
    this.titleService.setTitle('Kira Sekira');

    effect(() => {
      this.payload.getGlobal().then((global) => {
        if (global.aboutPhoto) {
          const media = global.aboutPhoto;
          const url = media.sizes?.gallery?.url || media.url;
          if (url) {
            this.aboutImage.set(url);
          }
        }

        if (global.aboutText) {
          const html = lexicalToHtml(global.aboutText);
          this.aboutText.set(html);
        }
      });
    });
  }
}
