import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DualGroupsSelectComponent } from './dual-groups-select.component';

@NgModule({
	declarations: [DualGroupsSelectComponent],
	exports: [DualGroupsSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ]
})
export class DualGroupsSelectModule {}
