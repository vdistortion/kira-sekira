import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-picture-card',
  imports: [],
  templateUrl: './picture-card.component.html',
  styleUrl: './picture-card.component.scss',
})
export class PictureCardComponent {
  @Input({ required: true }) public image!: string;
  @Input() public description: string = '';
}
