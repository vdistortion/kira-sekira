import { Component, EventEmitter, Input, Output } from '@angular/core';
import SmoothScroll from 'smooth-scroll';
import { LogoComponent } from '../../logo/logo.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [LogoComponent, PageTitleComponent, RouterLink],
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
      const anchor = document.querySelector('#projects');
      this.scroll.animateScroll(anchor);
    }, 0);
  }
}
