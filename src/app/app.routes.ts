import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { PricesPageComponent } from './pages/prices-page/prices-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { authGuard } from './auth.guard';

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
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    title: 'admin',
    component: AdminPageComponent,
    canActivate: [authGuard],
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
