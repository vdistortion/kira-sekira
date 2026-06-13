import { Component, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  activeSection = signal<string>('hero');

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.router.url !== '/') return;

    const sections = ['hero', 'portfolio', 'videos', 'contacts'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          this.activeSection.set(section);
        }
      }
    }
  }

  scrollToSection(sectionId: string): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.activeSection.set(sectionId);
      }
    }, 100);
  }
}
