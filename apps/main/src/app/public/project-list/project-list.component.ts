import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { PayloadService } from '../../payload.service';

@Component({
  selector: 'app-project-list',
  imports: [ProjectCardComponent, RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  private payload = inject(PayloadService);
  galleries = signal<any[]>([]);

  async ngOnInit() {
    const data = await this.payload.getGalleriesList();
    this.galleries.set(data);
  }
}
