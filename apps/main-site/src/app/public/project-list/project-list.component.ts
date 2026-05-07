import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { SanityService } from '../../sanity.service';

@Component({
  selector: 'app-project-list',
  imports: [ProjectCardComponent, RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  sanityService = inject(SanityService);
  galleries = signal<any[]>([]);

  async ngOnInit() {
    const data = await this.sanityService.getGalleriesList();
    this.galleries.set(data);
  }
}
