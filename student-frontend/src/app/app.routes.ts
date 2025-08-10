import { Routes } from '@angular/router';
import { authGuard, loginRedirectGuard } from './core/auth/auth.guard';
import { LayoutComponent } from './features/layout/layout.component';


export const routes: Routes = [

  {
    path: 'login',
    canActivate:[loginRedirectGuard],
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];
