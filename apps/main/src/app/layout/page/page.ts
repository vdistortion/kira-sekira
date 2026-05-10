import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../logo/logo';
import { Header } from '../header/header';

@Component({
  selector: 'app-page',
  imports: [RouterLink, Logo, Header],
  templateUrl: './page.html',
  styleUrl: './page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Page {
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
