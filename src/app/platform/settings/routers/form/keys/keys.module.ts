import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { TimingDialogModule } from 'src/app/platform/settings/routers/form/timing-dialog/timing-dialog.module';
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { TagsInputModule } from 'src/app/_shared/components/tags-input/tags-input.module';

import { KeysComponent } from 'src/app/platform/settings/routers/form/keys/keys.component';

const routes: Routes = [
  { path: '', component: KeysComponent }
];

@NgModule({
  declarations: [KeysComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
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
		AudioInputModule,
		BdSelectModule,
		TagsInputModule
	]
})
export class KeysModule {}
