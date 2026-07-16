import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-project-list',
  imports: [ProjectCard, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  galleries = input<any[]>([]);
}
