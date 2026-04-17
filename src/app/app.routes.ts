import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./auth/auth').then(c => c.AuthComponent) },
  { path: 'reset-password/:token', loadComponent: () => import('./reset-password/reset-password').then(c => c.ResetPasswordComponent) },
  { path: 'pos', loadComponent: () => import('./pos/pos').then(c => c.PosComponent), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./admin/admin').then(c => c.AdminComponent) }
];
