import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialogModule } from '@angular/material/dialog';

import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { ReassignDialogComponent } from 'src/app/platform/settings/permissions/reassign-dialog/reassign-dialog.component';

@NgModule({
  declarations: [ReassignDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    TranslateModule,
    BdSelectModule
  ]
})
export class ReassignDialogModule {}
