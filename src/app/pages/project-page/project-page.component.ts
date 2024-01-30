import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../components/page/page/page.component';
import { ProjectDetailComponent } from '../../components/project/project-detail/project-detail.component';
import projects, { TypeProjects } from '../../../projects';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [PageComponent, ProjectDetailComponent],
  templateUrl: './project-page.component.html',
})
export class ProjectPageComponent implements OnInit {
  public projects: TypeProjects = projects;
  public pageId: string | null;

  constructor(private route: ActivatedRoute) {
    this.pageId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    document.title = `${this.pageId} — Kira Sekira`;
  }
}
