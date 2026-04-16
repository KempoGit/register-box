import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./auth/auth').then(c => c.AuthComponent) },
  { path: 'reset-password/:token', loadComponent: () => import('./reset-password/reset-password').then(c => c.ResetPasswordComponent) }
];
