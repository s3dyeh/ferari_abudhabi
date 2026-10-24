import { Routes } from '@angular/router';
import { App } from './app';
import { CONTENT_PAGES } from './site-content';
export const routes: Routes = [
  { path: '', pathMatch: 'full', component: App },
  { path: 'work', loadComponent: () => import('./work-page').then(m => m.WorkPage) },
  ...CONTENT_PAGES.map(page => ({
    path: page.path.slice(1, -1),
    loadComponent: () => import('./content-page').then(m => m.ContentPage),
    data: { page },
  })),
];
