import { Component, OnInit } from '@angular/core';
import {
  NgxParticlesModule,
  NgParticlesService,
  IParticlesProps,
} from '@tsparticles/angular';
import { loadLinksPreset } from '@tsparticles/preset-links';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [NgxParticlesModule],
  templateUrl: './background.component.html',
})
export class BackgroundComponent implements OnInit {
  private color = '#101431';

  public options: IParticlesProps = {
    preset: 'links',
    background: {
      color: 'transparent',
    },
    particles: {
      size: {
        value: 1,
      },
      number: {
        value: 50,
      },
      move: {
        speed: 2,
      },
      shape: {
        type: 'circle',
      },
      links: {
        distance: 200,
        opacity: 0.1,
        color: this.color,
      },
    },
  };

  constructor(private readonly ngParticlesService: NgParticlesService) {}

  ngOnInit(): void {
    this.ngParticlesService
      .init(async (engine) => {
        await loadLinksPreset(engine);
      })
      .catch(console.error);
  }
}
