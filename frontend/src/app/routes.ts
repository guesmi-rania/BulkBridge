import { Routes } from '@angular/router';
import { Home } from './pages/home';           // eager: instant first paint, no API call
import { authGuard } from './core';
// every other page is lazy-loaded => tiny initial bundle
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalog', loadComponent: () => import('./pages/catalog').then(m => m.Catalog) },
  { path: 'cart', loadComponent: () => import('./pages/cart').then(m => m.CartPage) },
  { path: 'login', loadComponent: () => import('./pages/auth').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/auth').then(m => m.Register) },
  { path: 'verify/:token', loadComponent: () => import('./pages/auth').then(m => m.Verify) },
  { path: 'forgot', loadComponent: () => import('./pages/auth').then(m => m.Forgot) },
  { path: 'reset/:token', loadComponent: () => import('./pages/auth').then(m => m.Reset) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./pages/orders').then(m => m.Orders) },
  { path: '**', redirectTo: '' }
];
