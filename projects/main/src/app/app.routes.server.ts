import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { DirectusService } from 'shared';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const studio = inject(DirectusService);
      const slugs = await studio.getAllMainSlugs();
      return slugs.map((slug) => ({ id: slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
