import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { TagsInputModule } from 'src/app/_shared/components/tags-input/tags-input.module';
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';
import { ChipsInputModule } from 'src/app/_shared/components/chips-input/chips-input.module';

import { GeneralComponent } from 'src/app/platform/settings/routers/form/general/general.component';

import { GenericService } from 'src/app/_shared/services/http/generic.service';

const routes: Routes = [
  { path: '', component: GeneralComponent }
];

@NgModule({
  declarations: [GeneralComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    NgxMatDatetimePickerModule, NgxMatTimepickerModule,
    TranslateModule,
    TagsInputModule,
    AudioInputModule,
    ChipsInputModule
  ],
  providers: [GenericService]
})
export class GeneralModule {}
