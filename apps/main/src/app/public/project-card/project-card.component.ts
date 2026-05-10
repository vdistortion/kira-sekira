import { Component, Input } from '@angular/core';
import { UiCardComponent } from '../../ui/ui-card/ui-card.component';

@Component({
  selector: 'app-project-card',
  imports: [UiCardComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  @Input({ required: true }) public image!: string;
  @Input({ required: true }) public title!: string;
}
