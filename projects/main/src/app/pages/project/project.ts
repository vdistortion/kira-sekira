import { Component, signal } from '@angular/core';
import { Page } from '../../layout/page/page';
import { PictureList } from '../../features/gallery/picture-list/picture-list';

@Component({
  selector: 'app-project',
  imports: [Page, PictureList],
  templateUrl: './project.html',
})
export class Project {
  gallery = signal<{
    title: string;
    images: { url: string }[];
  } | null>(null);
}
