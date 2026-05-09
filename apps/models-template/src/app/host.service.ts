import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class HostService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /** Возвращает текущий поддомен или тестовую строку для localhost */
  getSubdomain(): string {
    if (isPlatformBrowser(this.platformId)) {
      const hostname = window.location.hostname;
      // Если localhost или IP, возвращаем тестовый поддомен
      if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.')) {
        return 'yana-katunova'; // замени на любой для проверки
      }
      // Иначе берём первую часть домена (например, "model1" из "model1.kira-sekira.ru")
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        return parts[0];
      }
    }
    // По умолчанию, если не браузер или не определили
    return 'yana-katunova';
  }
}
