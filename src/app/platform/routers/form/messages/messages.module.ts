import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';
import { ChipsInputModule } from 'src/app/_shared/components/chips-input/chips-input.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MessageTimingComponent } from '../messages/message-timing/message-timing.component';
import { MessagesComponent } from './messages.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@NgModule({
  declarations: [MessagesComponent, MessageTimingComponent],
  exports: [MessagesComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    DragDropModule,
    TranslateModule,
    AudioInputModule,
    ChipsInputModule
  ],
  providers: [ScheduleService, TranslatePipe]
})
export class MessagesModule {}
