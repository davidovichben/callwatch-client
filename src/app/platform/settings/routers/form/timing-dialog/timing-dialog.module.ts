import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { TimingDialogComponent } from 'src/app/platform/settings/routers/form/timing-dialog/timing-dialog.component';

@NgModule({
  declarations: [TimingDialogComponent],
  exports: [TimingDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule,
    TranslateModule,
  ]
})
export class TimingDialogModule {}
