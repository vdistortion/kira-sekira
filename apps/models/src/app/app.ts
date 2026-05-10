import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Content } from './layout/content/content';
import { HostService } from './host.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Content],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private hostService = inject(HostService);
  // Сигнал с поддоменом, доступный всем дочерним компонентам
  subdomain = signal<string>(this.hostService.getSubdomain());
}
