import { Component, Input } from '@angular/core';
import { UiCardComponent } from '../../ui/ui-card/ui-card.component';
import { TypeProject, TypeImage } from '../../../projects';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [UiCardComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  @Input({ required: true }) public project: TypeProject;

  getSrc(images: TypeImage[] = []) {
    const imageMain = images.find((img) => {
      const [name] = img.name.split('.');
      return name === 'main';
    });
    return imageMain ? imageMain.src : images[0].src;
  }
}
