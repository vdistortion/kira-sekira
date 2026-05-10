import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { mdiArrowLeft } from '@mdi/js';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  @Input({ required: true }) public icon!: string;

  public icons: any = {
    mdiArrowLeft,
  };
}
