import { Component, Input } from '@angular/core';
import { IOutputProject } from '../../../../projects';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  @Input() public project: IOutputProject;
}
