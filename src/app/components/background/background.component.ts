import { Component, OnInit } from '@angular/core';
import { NgxParticlesModule, NgParticlesService } from '@tsparticles/angular';
import { loadLinksPreset } from '@tsparticles/preset-links';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [NgxParticlesModule],
  templateUrl: './background.component.html',
})
export class BackgroundComponent implements OnInit {
  private color = '#101431';

  public options = {
    preset: 'links',
    background: {
      color: {
        value: 'transparent',
      },
    },
    particles: {
      shape: {
        type: 'circle',
      },
      links: {
        color: this.color,
        opacity: 0.5,
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
