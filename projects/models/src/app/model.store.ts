import { Injectable, signal } from '@angular/core';

/** Shared state for the resolved model (set by the home page, read by the navbar). */
@Injectable({ providedIn: 'root' })
export class ModelStore {
  name = signal<string>('');
}
