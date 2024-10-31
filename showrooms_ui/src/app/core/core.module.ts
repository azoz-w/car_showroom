import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService } from './services/car.service';
import { ShowroomService } from './services/showroom.service';
import { ToastService } from './services/toast.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ShowroomService, CarService, ToastService],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it only in AppModule'
      );
    }
  }
}
