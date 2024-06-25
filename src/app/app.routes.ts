import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { PricesPageComponent } from './pages/prices-page/prices-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';

export const routes: Routes = [
  {
    path: '',
    title: 'home',
    component: HomePageComponent,
  },
  {
    path: 'auth',
    title: 'auth',
    component: AuthPageComponent,
  },
  {
    path: 'admin',
    title: 'admin',
    component: AdminPageComponent,
  },
  {
    path: 'prices',
    title: 'prices',
    component: PricesPageComponent,
  },
  {
    path: ':id',
    title: 'project',
    component: ProjectPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
