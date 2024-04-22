import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { ReassignDialogComponent } from './reassign-dialog.component';

@NgModule({
  declarations: [ReassignDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    TranslateModule,
    UnitSelectModule
  ]
})
export class ReassignDialogModule {}
