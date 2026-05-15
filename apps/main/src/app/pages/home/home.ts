import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Page } from '../../layout/page/page';
import { ProjectList } from '../../features/projects/project-list/project-list';
import { PayloadService } from '../../payload.service';
import { lexicalToHtml } from '../../utils/lexical.util';

@Component({
  selector: 'app-home',
  imports: [Page, ProjectList, CommonModule],
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

  get yearsCount() {
    const word = this.declensionOfNouns(this.years, ['год', 'года', 'лет']);
    return [this.years, word].join(' ');
  }

  get years() {
    const today = new Date();
    const date = new Date('2019-05-01');
    const m = today.getMonth() - date.getMonth();
    let years = today.getFullYear() - date.getFullYear();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) years--;
    return years;
  }

  declensionOfNouns(number: number, titles: string[]) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }
}
