import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ShowroomDetailsComponent } from './showroom-details/showroom-details.component';
import { ShowroomManagementComponent } from './showroom-management/showroom-management.component';

const routes: Routes = [
  {
    path: '',
    component: ShowroomManagementComponent,
  },
  {
    path: ':commercialRegistrationNumber',
    component: ShowroomDetailsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class ShowroomModule {}
