import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
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
  private route = inject(ActivatedRoute);
  public projects: TypeProjects = projects;
  private pageId$ = this.route.paramMap.pipe(map((params) => params.get('id')));
  public pageId = toSignal(this.pageId$);

  ngOnInit() {
    this.titleService.setTitle(`${this.pageId()} — Kira Sekira`);
  }
}
