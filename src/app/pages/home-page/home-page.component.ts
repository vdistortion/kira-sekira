import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PageComponent } from '../../components/page/page/page.component';
import { ProjectListComponent } from '../../components/project/project-list/project-list.component';
import projects, { IOutputProjects } from '../../../projects';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [PageComponent, ProjectListComponent, NgOptimizedImage],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  public activeTag: string = 'all';

  ngOnInit() {
    document.title = 'Kira Sekira';
  }

  onVisible(tag: string) {
    this.activeTag = this.activeTag === tag ? 'all' : tag;
  }

  get tags() {
    return Object.entries(projects as IOutputProjects).reduce(
      (acc, [id, project]) => {
        project.tags.forEach((tag) => {
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(id);
        });
        return acc;
      },
      {
        all: Object.keys(projects),
      } as {
        [index: string]: string[];
      },
    );
  }

  get cloud(): string[] {
    return Object.keys(this.tags);
  }

  get visibleProjects(): IOutputProjects {
    return this.tags[this.activeTag].reduce(
      (list: IOutputProjects, id) => ({
        ...list,
        [id]: projects[id],
      }),
      {},
    );
  }
}
