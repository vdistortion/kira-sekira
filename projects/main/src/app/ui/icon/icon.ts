import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
})
export class Icon {
  @Input({ required: true }) public icon!: string;

  public icons: Record<string, string> = {};
}
