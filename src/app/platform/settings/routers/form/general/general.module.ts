import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
