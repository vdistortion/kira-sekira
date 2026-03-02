import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../public/page/page.component';
import { ProjectDetailComponent } from '../../public/project-detail/project-detail.component';
import projects, { TypeProjects } from '../../../projects';

@Component({
  selector: 'app-project-page',
  imports: [PageComponent, ProjectDetailComponent],
  templateUrl: './project-page.component.html',
})
export class ProjectPageComponent implements OnInit {
  private titleService = inject(Title);
  public projects: TypeProjects = projects;
  public pageId: string | null;

  constructor(private route: ActivatedRoute) {
    this.pageId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.titleService.setTitle(`${this.pageId} — Kira Sekira`);
  }
}
