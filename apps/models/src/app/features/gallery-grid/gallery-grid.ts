import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-gallery-grid',
  imports: [],
  templateUrl: './gallery-grid.html',
  styleUrl: './gallery-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryGrid {}
