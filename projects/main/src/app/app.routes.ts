import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Project } from './pages/project/project';

export const routes: Routes = [
  {
    path: '',
    title: 'Фотограф на корпоратив — Кира Секира',
    component: Home,
  },
  { path: 'about', title: 'Обо мне — Кира Секира', component: Home, data: { about: true } },
  {
    path: 'portfolio/:slug',
    title: 'project',
    component: Project,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
