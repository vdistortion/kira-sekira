import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageComponent } from '../../public/page/page.component';
import { ProjectListComponent } from '../../public/project-list/project-list.component';
import { PayloadService } from '../../payload.service';

@Component({
  selector: 'app-home-page',
  imports: [PageComponent, ProjectListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private titleService = inject(Title);
  private payload = inject(PayloadService);
  aboutImage = signal('');
  projectsName = signal('Проекты'); // можно взять из mainSite.aboutText или другого поля

  async ngOnInit() {
    this.titleService.setTitle('Kira Sekira');
    const global = await this.payload.getGlobal();
    if (global.aboutPhoto?.url) {
      this.aboutImage.set(global.aboutPhoto.url);
    }
    // Можно добавить отдельное поле для заголовка проектов в global, пока используем статику
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
