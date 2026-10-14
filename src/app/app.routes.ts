import { Routes } from '@angular/router';
import { App } from './app';
export const routes: Routes = [
  { path: '', pathMatch: 'full', component: App },
  { path: 'work', loadComponent: () => import('./work-page').then(m => m.WorkPage) },
];
