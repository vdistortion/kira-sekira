import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCard } from '../project-card/project-card';
import { PayloadService } from '../../../payload.service';

@Component({
  selector: 'app-project-list',
  imports: [ProjectCard, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList implements OnInit {
  private payload = inject(PayloadService);
  galleries = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await this.payload.getGalleriesList();
      this.galleries.set(data);
    } catch (err) {
      console.error('Error loading galleries:', err);
      this.error.set('Ошибка загрузки проектов');
    } finally {
      this.loading.set(false);
    }
  }
}
