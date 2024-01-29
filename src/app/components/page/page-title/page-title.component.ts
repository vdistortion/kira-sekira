import { Component, Input } from '@angular/core';
import { UiIconComponent } from '../../ui/ui-icon/ui-icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [UiIconComponent, RouterLink],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
})
export class PageTitleComponent {
  @Input() public title: string = '';
}
