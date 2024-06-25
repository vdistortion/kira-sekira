import { Component, Input } from '@angular/core';
import { mdiArrowLeft } from '@mdi/js';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [],
  templateUrl: './ui-icon.component.html',
})
export class UiIconComponent {
  @Input({ required: true }) public icon: string;

  public icons: any = {
    mdiArrowLeft,
  };
}
