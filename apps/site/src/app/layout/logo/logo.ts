import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { PayloadService } from '../../payload.service';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  private payload = inject(PayloadService);
  title = signal('Kira Sekira');

  constructor() {
    effect(() => {
      this.payload.getGlobal().then((global) => {
        // если добавишь поле siteTitle в MainSite, используй его
        // this.title.set(global.siteTitle || 'Kira Sekira');
      });
    });
  }
}
