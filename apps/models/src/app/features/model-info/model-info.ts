import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-model-info',
  imports: [],
  templateUrl: './model-info.html',
  styleUrl: './model-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelInfo {
  @Input() parameters?: {
    height?: number;
    weight?: number;
    chest?: number;
    waist?: number;
    hips?: number;
  };
  @Input() contacts?: {
    phone?: string;
    telegram?: string;
    whatsapp?: string;
    email?: string;
  };
}
