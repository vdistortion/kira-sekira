import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  inject,
  effect,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../logo/logo';
import { Header } from '../header/header';
import { PayloadService } from '../../payload.service';

interface Contacts {
  phone?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
}

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

  private payload = inject(PayloadService);
  public scroll: any;
  contacts = signal<Contacts>({});

  constructor() {
    afterNextRender(() => {
      import('smooth-scroll').then((SmoothScroll) => {
        this.scroll = new SmoothScroll.default('a[href*="#"]', {
          speed: 500,
          speedAsDuration: true,
        });
      });
    });

    effect(() => {
      this.payload
        .getGlobal()
        .then((global) => {
          if (global.contacts) {
            this.contacts.set(global.contacts);
          }
        })
        .catch((err) => {
          console.error('Error loading contacts:', err);
        });
    });
  }

  animateScroll() {
    if (this.projectsElement && this.scroll) {
      this.scroll.animateScroll(this.projectsElement.nativeElement);
    }
  }
}
