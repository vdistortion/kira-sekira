import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  aboutImage = signal('');
  aboutText = signal('');
  projectsName = signal('Проекты');

  constructor() {
    this.titleService.setTitle('Kira Sekira');
  }
}
