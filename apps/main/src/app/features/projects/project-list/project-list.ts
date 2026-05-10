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

  async ngOnInit() {
    const data = await this.payload.getGalleriesList();
    this.galleries.set(data);
  }
}
