import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

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
