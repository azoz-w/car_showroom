import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowroomDetailsComponent } from './features/showroom-details/showroom-details.component';
import { ShowroomManagementComponent } from './features/showroom-management/showroom-management.component';

export const routes: Routes = [
  {
    path: 'showroom-management',
    component: ShowroomManagementComponent,
  },
  {
    path: 'showroom/:commercialRegistrationNumber',
    component: ShowroomDetailsComponent,
  },

  { path: '', redirectTo: '/showroom-management', pathMatch: 'full' },
  { path: '**', redirectTo: '/showroom-management' },
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
