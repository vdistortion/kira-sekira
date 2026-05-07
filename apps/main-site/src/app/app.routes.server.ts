import { RenderMode, ServerRoute } from '@angular/ssr';
import { SanityService } from './sanity.service';
import { inject } from '@angular/core';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const sanityService = inject(SanityService);
      const slugs = await sanityService.getAllSlugs();
      return slugs.map((slug) => ({ id: slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
