import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Portfolio } from './pages/portfolio/portfolio';
import { Project } from './pages/project/project';
import { Video } from './pages/video/video';
import { Contacts } from './pages/contacts/contacts';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'portfolio',
    component: Portfolio,
  },
  {
    path: 'portfolio/:id',
    component: Project,
  },
  {
    path: 'video',
    component: Video,
  },
  {
    path: 'contacts',
    component: Contacts,
  },
];
