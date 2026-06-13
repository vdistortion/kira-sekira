import { Component, Input } from '@angular/core';
import { Card } from '../../../ui/card/card';

@Component({
  selector: 'app-project-card',
  imports: [Card],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  @Input({ required: true }) public image!: string;
  @Input({ required: true }) public title!: string;
}
