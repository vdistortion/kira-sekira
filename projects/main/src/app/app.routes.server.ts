import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { DirectusService } from 'shared';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'portfolio/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const studio = inject(DirectusService);
      try {
        const slugs = await studio.getAllMainSlugs();
        return slugs.map((slug) => ({ slug }));
      } catch (error) {
        console.warn('Failed to fetch main slugs for prerender:', error);
        return []; // fallback
      }
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
