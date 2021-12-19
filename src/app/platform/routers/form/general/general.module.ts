import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { ChipsInputModule } from 'src/app/_shared/components/chips-input/chips-input.module';
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';

import { GeneralComponent } from './general.component';

@NgModule({
  declarations: [GeneralComponent],
  exports: [GeneralComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule, NgxMatTimepickerModule,
    TranslateModule,
    ChipsInputModule,
    AudioInputModule,
  ]
})
export class GeneralModule {}
