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
}
