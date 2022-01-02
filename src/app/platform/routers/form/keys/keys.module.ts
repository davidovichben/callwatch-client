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
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';

import { KeysComponent } from './keys.component';

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
    AudioInputModule
  ]
})
export class KeysModule {}
