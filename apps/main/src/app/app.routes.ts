import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Prices } from './pages/prices/prices';
import { Project } from './pages/project/project';

export const routes: Routes = [
  {
    path: '',
    title: 'home',
    component: Home,
  },
  {
    path: 'prices',
    title: 'prices',
    component: Prices,
  },
  {
    path: ':id',
    title: 'project',
    component: Project,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
