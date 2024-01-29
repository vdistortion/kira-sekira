import { Component, Input } from '@angular/core';
import { mdiArrowLeft, mdiLinkVariant } from '@mdi/js';

@Component({
  selector: 'app-ui-icon',
  standalone: true,
  imports: [],
  templateUrl: './ui-icon.component.html',
})
export class UiIconComponent {
  @Input({ required: true }) public icon: string;

  public icons: any = {
    mdiArrowLeft,
    mdiLinkVariant,
  };
}
