import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PayloadService } from '../../payload.service';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo implements OnInit {
  private payload = inject(PayloadService);
  title = signal('Kira Sekira');

  async ngOnInit() {
    const global = await this.payload.getGlobal();
    // если добавишь поле siteTitle в MainSite, используй его
    // this.title.set(global.siteTitle || 'Kira Sekira');
  }
}
