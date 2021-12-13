import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';
import { ChipsInputModule } from 'src/app/_shared/components/chips-input/chips-input.module';
import { TimingDialogModule } from 'src/app/platform/routers/form/timing-dialog/timing-dialog.module';

import { MessagesComponent } from './messages.component';

@NgModule({
  declarations: [MessagesComponent],
  exports: [MessagesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    DragDropModule,
    TranslateModule,
    AudioInputModule,
    ChipsInputModule,
    TimingDialogModule
  ]
})
export class MessagesModule {}
