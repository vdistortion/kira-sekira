import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Page } from '../../layout/page/page';
import { ProjectList } from '../../features/projects/project-list/project-list';
import { PayloadService } from '../../payload.service';
import { lexicalToHtml } from '../../utils/lexical.util';

@Component({
  selector: 'app-home',
  imports: [Page, ProjectList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private titleService = inject(Title);
  private payload = inject(PayloadService);
  aboutImage = signal('');
  aboutText = signal('');
  projectsName = signal('Проекты');

  async ngOnInit() {
    this.titleService.setTitle('Kira Sekira');

    try {
      const global = await this.payload.getGlobal();

      // Фото
      if (global.aboutPhoto) {
        const media = global.aboutPhoto;
        const url = media.sizes?.gallery?.url || media.url;
        if (url) {
          this.aboutImage.set(url);
        }
      }

      // Текст о фотографе (richText → HTML)
      if (global.aboutText) {
        const html = lexicalToHtml(global.aboutText);
        this.aboutText.set(html);
      }
    } catch (err) {
      console.error('Error loading home data:', err);
    }
  }
}
