import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-picture-card',
  imports: [],
  templateUrl: './picture-card.html',
  styleUrl: './picture-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureCard {
  @Input({ required: true }) public image!: string;
  @Input() public description: string = '';
}
