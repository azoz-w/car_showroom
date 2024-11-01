import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowroomDetailsComponent } from './features/showroom/showroom-details/showroom-details.component';
import { ShowroomManagementComponent } from './features/showroom/showroom-management/showroom-management.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'showroom',
    loadChildren: () =>
      import('./features/showroom/showroom.module').then(
        (m) => m.ShowroomModule
      ),
    canActivateChild: [authGuard],
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  { path: '', redirectTo: '/showroom', pathMatch: 'full' },
  { path: '**', redirectTo: '/showroom' },
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
