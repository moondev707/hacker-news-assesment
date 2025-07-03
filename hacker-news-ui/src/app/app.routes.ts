import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/story-list/story-list.component').then(m => m.StoryListComponent) },
];
