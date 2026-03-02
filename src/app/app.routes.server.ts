import { RenderMode, ServerRoute } from '@angular/ssr';
import projects from '../projects';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return Object.values(projects).map((project) => ({ id: project.name }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
