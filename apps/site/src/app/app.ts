import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxParticlesModule } from '@tsparticles/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxParticlesModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  public particlesOptions = {
    background: { color: 'transparent' },
    particles: {
      color: { value: '#101431' },
      size: { value: 1 },
      number: { value: 50 },
      move: { speed: 2, enable: true },
      shape: { type: 'circle' },
      links: {
        distance: 200,
        opacity: 0.2,
        enable: true,
        color: '#101431',
      },
    },
  };
}
