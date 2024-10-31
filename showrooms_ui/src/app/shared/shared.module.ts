import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { ModalComponent } from './components/modal/modal.component';
import { CreateShowroomComponent } from './components/create-showroom-component/create-showroom.component';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [ModalComponent, ToastComponent, CreateShowroomComponent],
})
export class SharedModule {}
