import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { PayloadService } from './payload.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const payload = inject(PayloadService);
      const slugs = await payload.getAllSlugs();
      return slugs.map((slug) => ({ id: slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
