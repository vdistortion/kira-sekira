import { Component, Input, OnInit } from '@angular/core';
import { LightgalleryModule } from 'lightgallery/angular';
import { PictureCardComponent } from '../picture-card/picture-card.component';
import { TypeImage } from '../../../../projects';

@Component({
  selector: 'app-picture-list',
  standalone: true,
  imports: [PictureCardComponent, LightgalleryModule],
  templateUrl: './picture-list.component.html',
  styleUrl: './picture-list.component.scss',
})
export class PictureListComponent implements OnInit {
  @Input() public images: TypeImage[] = [];
  public isInit: boolean = false;

  options = {
    download: false,
    getCaptionFromTitleOrAlt: false,
  };

  ngOnInit() {
    this.isInit = true;
  }
}
