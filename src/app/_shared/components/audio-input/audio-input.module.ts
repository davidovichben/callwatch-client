import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { AudioInputComponent } from './audio-input.component';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@NgModule({
	declarations: [AudioInputComponent],
	exports: [AudioInputComponent],
	imports: [
    CommonModule,
		MatIconModule,
    MatMenuModule,
    TranslateModule
	],
  providers: [TranslatePipe]
})
export class AudioInputModule {}
