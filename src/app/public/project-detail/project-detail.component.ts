import { Component, Input } from '@angular/core';
import { PictureListComponent } from '../picture-list/picture-list.component';
import { TypeImage } from '../../../projects';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [PictureListComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent {
  @Input() public images: TypeImage[] = [];
}
