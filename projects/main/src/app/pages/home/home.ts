import { Component, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DirectusService, MarkdownPipe, YoutubeEmbedPipe } from 'shared';
import { Page } from '../../layout/page/page';
import { ProjectList } from '../../features/projects/project-list/project-list';

@Component({
  selector: 'app-home',
  imports: [MarkdownPipe, YoutubeEmbedPipe, Page, ProjectList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private studio = inject(DirectusService);

  aboutImage = signal('');
  aboutMarkdown = signal('');
  tagline = signal('');
  experienceText = signal('');
  videos = signal<any[]>([]);
  galleries = signal<any[]>([]);
  prices = signal<any[]>([]);
  reviews = signal<any[]>([]);
  projectsName = signal('Проекты');
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.titleService.setTitle('Kira Sekira');

    Promise.all([
      this.studio.getMainSite(),
      this.studio.getPrices(),
      this.studio.getReviews(),
    ])
      .then(([data, prices, reviews]) => {
        this.aboutImage.set(data.main_photo_url || '');
        this.aboutMarkdown.set(data.advantages_md || '');
        this.tagline.set(data.tagline || '');
        if (data.experience_since) {
          const years = new Date().getFullYear() - data.experience_since;
          this.experienceText.set(`Опыт работы ${years} лет`);
        }
        this.videos.set(data.videos || []);
        this.galleries.set(data.galleries || []);
        this.prices.set(prices || []);
        this.reviews.set(reviews || []);
        this.setSeo(
          'Kira Sekira — фотограф в Москве',
          'Фотосъёмки в Москве: индивидуальные, семейные, детские фотосессии, лав стори, репортажная съёмка мероприятий и концертов. Фотограф Kira Sekira.',
          data.main_photo_url || '',
        );
        this.loading.set(false);
      })
      .catch((err) => {
        console.error('Failed to load main site', err);
        this.error.set('Ошибка загрузки данных');
        this.loading.set(false);
      });
  }

  private setSeo(title: string, description: string, image?: string) {
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }
  }
}
