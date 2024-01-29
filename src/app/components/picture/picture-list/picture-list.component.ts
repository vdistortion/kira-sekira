import { Component, Input } from '@angular/core';
import { LightgalleryModule } from 'lightgallery/angular';
import { PictureCardComponent } from '../picture-card/picture-card.component';
import { TypeImage } from '../../../../projects';

@Component({
  selector: 'app-picture-list',
  standalone: true,
  imports: [PictureCardComponent, LightgalleryModule],
  templateUrl: './picture-list.component.html',
})
export class PictureListComponent {
  @Input() public images: TypeImage[] = [];

  options = {
    download: false,
    getCaptionFromTitleOrAlt: false,
  };
}
