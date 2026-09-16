import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class HostService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /** Возвращает текущий поддомен или тестовую строку для localhost */
  getSubdomain(): string {
    if (isPlatformBrowser(this.platformId)) {
      // Локальный предпросмотр конкретной модели: ?m=yana
      const override = new URLSearchParams(window.location.search).get('m');
      if (override) {
        return override;
      }
      const hostname = window.location.hostname;
      // Если localhost или IP без ?m=, открываем демо-модель yana.
      if (
        hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('192.168.')
      ) {
        return 'yana';
      }
      // Иначе берём первую часть домена
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        return parts[0];
      }
    }
    return 'yana';
  }
}
