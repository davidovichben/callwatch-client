import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from 'src/app/platform/layout/layout.module';
import { AdminRoutingModule } from 'src/app/admin/admin-routing.module';

import { AdminComponent } from 'src/app/admin/admin.component';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutModule
  ]
})
export class AdminModule {}
