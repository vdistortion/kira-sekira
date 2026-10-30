import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { DIRECTUS_API_URL } from 'shared';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({anchorScrolling:'enabled',scrollPositionRestoration:'enabled'})),
    provideClientHydration(withEventReplay()),
    {provide:DIRECTUS_API_URL,useValue:environment.apiUrl},
  ],
};
