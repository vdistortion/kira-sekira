import { afterNextRender, Component, ContentChild, ElementRef, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-page',
  imports: [RouterLink, LogoComponent, PageTitleComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  @Input() public title: string = '';
  @Input() public isHomePage: boolean = false;
  @ContentChild('#projects') projectsElement!: ElementRef;
  public isAuth: boolean = false;
  public isAdmin: boolean = false;
  public scroll: any;

  constructor(private base: SupabaseService) {
    afterNextRender(() => {
      import('smooth-scroll').then((SmoothScroll) => {
        this.scroll = new SmoothScroll.default('a[href*="#"]', {
          speed: 500,
          speedAsDuration: true,
        });
      });
    });

    this.base.user$.subscribe(() => {
      this.isAuth = this.base.isAuth();
      this.isAdmin = this.base.isAdmin();
    });
  }

  animateScroll() {
    if (this.projectsElement) {
      this.scroll.animateScroll(this.projectsElement.nativeElement);
    }
  }

  logOut() {
    this.base.logOut();
  }
}
