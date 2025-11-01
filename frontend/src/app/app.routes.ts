import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'promo-codes',
    pathMatch: 'full'
  },
  {
    path: 'promo-codes',
    loadComponent: () => import('./features/promo-codes/promo-code-list/promo-code-list.component')
      .then(m => m.PromoCodeListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'promo-codes/create',
    loadComponent: () => import('./features/promo-codes/promo-code-form/promo-code-form.component')
      .then(m => m.PromoCodeFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'promo-codes/edit/:id',
    loadComponent: () => import('./features/promo-codes/promo-code-form/promo-code-form.component')
      .then(m => m.PromoCodeFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  }
];
