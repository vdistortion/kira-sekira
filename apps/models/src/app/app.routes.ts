import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Project } from './pages/project/project';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'portfolio/:id',
    component: Project,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
