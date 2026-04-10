import { afterNextRender, Component, ContentChild, ElementRef, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-page',
  imports: [RouterLink, LogoComponent, PageTitleComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  @Input() public title: string = '';
  @Input() public isHomePage: boolean = false;
  @ContentChild('projectsTarget') projectsElement!: ElementRef;
  public scroll: any;

  constructor() {
    afterNextRender(() => {
      import('smooth-scroll').then((SmoothScroll) => {
        this.scroll = new SmoothScroll.default('a[href*="#"]', {
          speed: 500,
          speedAsDuration: true,
        });
      });
    });
  }

  animateScroll() {
    if (this.projectsElement && this.scroll) {
      this.scroll.animateScroll(this.projectsElement.nativeElement);
    }
  }
}
