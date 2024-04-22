import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';
import { TagsInputModule } from 'src/app/_shared/components/tags-input/tags-input.module';
import { TimingDialogModule } from 'src/app/platform/settings/routers/form/timing-dialog/timing-dialog.module';

import { MessagesComponent } from 'src/app/platform/settings/routers/form/messages/messages.component';

const routes: Routes = [
  { path: '', component: MessagesComponent }
];

@NgModule({
  declarations: [MessagesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule,
    DragDropModule,
    TranslateModule,
    BdSelectModule,
    AudioInputModule,
    TagsInputModule,
    TimingDialogModule
  ]
})
export class MessagesModule {}
