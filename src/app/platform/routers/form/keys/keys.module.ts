import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { TimingDialogModule } from 'src/app/platform/routers/form/timing-dialog/timing-dialog.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';

import { KeysComponent } from './keys.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

@NgModule({
  declarations: [KeysComponent],
  exports: [KeysComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatRadioModule,
    TranslateModule,
    TimingDialogModule,
    BdSelectModule,
    AudioInputModule
  ],
  providers: [ScheduleService]
})
export class KeysModule {}
