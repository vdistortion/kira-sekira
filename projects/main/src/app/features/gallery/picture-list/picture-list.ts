import { Component, Input } from '@angular/core';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery';
import { PictureCard } from '../picture-card/picture-card';

@Component({
  selector: 'app-picture-list',
  imports: [PictureCard, PhotoGalleryModule],
  templateUrl: './picture-list.html',
  styleUrl: './picture-list.scss',
})
export class PictureList {
  @Input() public images: { url: string }[] = [];
}
