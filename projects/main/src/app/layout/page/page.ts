import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  signal,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DirectusService } from 'shared';
import { Logo } from '../logo/logo';
import { Header } from '../header/header';

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
})
export class Page {
  @Input() public title: string = '';
  @Input() public isHomePage: boolean = false;
  @ContentChild('projectsTarget') projectsElement!: ElementRef;

  private studio = inject(DirectusService);

  public scroll: any;
  contacts = signal<Contacts>({});

  constructor() {
    // Загрузка контактов
    this.studio
      .getContacts()
      .then((c) => this.contacts.set(c))
      .catch((err) => console.error('Failed to load contacts', err));

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
