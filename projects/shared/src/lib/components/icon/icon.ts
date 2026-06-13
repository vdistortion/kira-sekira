import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import 'iconify-icon';

// https://icon-sets.iconify.design/
@Component({
  selector: 'ks-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Icon {
  icon = input.required<string>();
  size = input<number>();
  width = input<number>();
  height = input<number>();

  effectiveWidth = computed(() => this.width() ?? this.size() ?? null);
  effectiveHeight = computed(() => this.height() ?? this.size() ?? null);
}
