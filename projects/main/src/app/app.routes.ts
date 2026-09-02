import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Project } from './pages/project/project';

export const routes: Routes = [
  {
    path: '',
    title: 'Kira Sekira — фотограф в Москве',
    component: Home,
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
