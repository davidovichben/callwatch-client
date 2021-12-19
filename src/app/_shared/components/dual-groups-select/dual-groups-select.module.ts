import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DualGroupsSelectComponent } from './dual-groups-select.component';

@NgModule({
	declarations: [DualGroupsSelectComponent],
	exports: [DualGroupsSelectComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class DualGroupsSelectModule {}
