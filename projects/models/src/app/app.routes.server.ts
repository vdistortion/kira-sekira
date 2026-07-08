import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { DirectusService } from 'shared';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'portfolio/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const studio = inject(DirectusService);
      try {
        const slugs = await studio.getAllModelsSlugs();
        return slugs.map((slug) => ({ id: slug }));
      } catch (error) {
        console.warn('Failed to fetch model slugs for prerender:', error);
        return []; // fallback
      }
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
