import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { AudioInputComponent } from './audio-input.component';

@NgModule({
	declarations: [AudioInputComponent],
	exports: [AudioInputComponent],
	imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
		MatIconModule,
    TranslateModule
	]
})
export class AudioInputModule {}
