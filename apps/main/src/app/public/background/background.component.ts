import { afterNextRender, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxParticlesModule, NgParticlesService, IParticlesProps } from '@tsparticles/angular';
import { loadLinksPreset } from '@tsparticles/preset-links';

@Component({
  selector: 'app-background',
  imports: [NgxParticlesModule],
  template: `
    @if (isBrowser()) {
      <ngx-particles [options]="options"></ngx-particles>
    }
  `,
})
export class BackgroundComponent {
  protected isBrowser = signal(false);
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

  constructor(private readonly ngParticlesService: NgParticlesService) {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser.set(isPlatformBrowser(platformId));

    afterNextRender(() => {
      this.ngParticlesService
        .init(async (engine) => {
          await loadLinksPreset(engine);
        })
        .catch(console.error);
    });
  }
}
