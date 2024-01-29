import { Component, EventEmitter, Input, Output } from '@angular/core';
import SmoothScroll from 'smooth-scroll';
import { LogoComponent } from '../../logo/logo.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [LogoComponent, PageTitleComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  @Input() public title: string = '';
  @Input() public link: string = '';
  @Input() public tags: string[] = [];
  @Input() public activeTag: string = '';
  @Output() visible: EventEmitter<any> = new EventEmitter();

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
