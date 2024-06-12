import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../../components/page/page/page.component';
import { ProjectListComponent } from '../../components/project/project-list/project-list.component';
import projects, { TypeProjects } from '../../../projects';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [PageComponent, ProjectListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  public projects: TypeProjects = projects;

  ngOnInit() {
    document.title = 'Kira Sekira';
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
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }
}
