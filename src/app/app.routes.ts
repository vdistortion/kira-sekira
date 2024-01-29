import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PricesPageComponent } from './pages/prices-page/prices-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'prices',
    component: PricesPageComponent,
  },
  {
    path: ':id',
    component: ProjectPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
