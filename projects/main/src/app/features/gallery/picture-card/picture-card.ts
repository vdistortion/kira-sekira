import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-picture-card',
  imports: [],
  templateUrl: './picture-card.html',
  styleUrl: './picture-card.scss',
})
export class PictureCard {
  @Input({ required: true }) public image!: string;
  @Input() public description: string = '';
}
