import { Routes } from '@angular/router';
import { MainPage } from './pages/main-page/main-page';
import { PortfolioPage } from './pages/portfolio-page/portfolio-page';
import { ProjectPage } from './pages/project-page/project-page';
import { VideoPage } from './pages/video-page/video-page';
import { ContactsPage } from './pages/contacts-page/contacts-page';

export const routes: Routes = [
  {
    path: '',
    component: MainPage,
  },
  {
    path: 'portfolio',
    component: PortfolioPage,
  },
  {
    path: 'portfolio/:id',
    component: ProjectPage,
  },
  {
    path: 'video',
    component: VideoPage,
  },
  {
    path: 'contacts',
    component: ContactsPage,
  },
];
