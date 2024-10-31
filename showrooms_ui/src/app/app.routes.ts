import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowroomDetailsComponent } from './features/showroom/showroom-details/showroom-details.component';
import { ShowroomManagementComponent } from './features/showroom/showroom-management/showroom-management.component';

export const routes: Routes = [
  {
    path: 'showroom',
    loadChildren: () =>
      import('./features/showroom/showroom.module').then(
        (m) => m.ShowroomModule
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
