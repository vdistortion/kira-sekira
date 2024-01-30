import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import SmoothScroll from 'smooth-scroll';
import { LogoComponent } from '../../logo/logo.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [RouterLink, LogoComponent, PageTitleComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  @Input() public title: string = '';
  @Input() public isHomePage: boolean = false;

  public scroll: any = new SmoothScroll('a[href*="#"]', {
    speed: 500,
    speedAsDuration: true,
  });

  animateScroll() {
    setTimeout(() => {
      const anchor: HTMLDivElement | null = document.querySelector('#projects');
      if (anchor) this.scroll.animateScroll(anchor);
    }, 0);
  }
}
