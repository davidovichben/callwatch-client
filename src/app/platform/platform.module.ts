import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformRoutingModule } from './platform-routing.module';

import { LayoutModule } from 'src/app/platform/layout/layout.module';

import { PlatformComponent } from 'src/app/platform/platform.component';

@NgModule({
  declarations: [PlatformComponent],
  imports: [
    CommonModule,
    PlatformRoutingModule,
    LayoutModule
  ]
})
export class PlatformModule {}
