import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { TypeProjects } from '../../../../projects';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [ProjectCardComponent, RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {
  @Input() public projects: TypeProjects;

  get visibleProjects() {
    return Object.values(this.projects);
  }
}
