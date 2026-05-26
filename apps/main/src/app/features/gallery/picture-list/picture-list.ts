import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery';
import { PictureCard } from '../picture-card/picture-card';
import type { TypeImage } from '@kira-sekira/shared';

@Component({
  selector: 'app-picture-list',
  imports: [PictureCard, PhotoGalleryModule],
  templateUrl: './picture-list.html',
  styleUrl: './picture-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureList {
  @Input() public images: TypeImage[] = [];
}
