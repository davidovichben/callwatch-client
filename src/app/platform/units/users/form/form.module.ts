import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';

import { FormComponent } from 'src/app/platform/units/users/form/form.component';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    TranslateModule,
    BdSelectModule
  ],
  providers: [UnitService],
  exports: [FormComponent]
})
export class FormModule {}
