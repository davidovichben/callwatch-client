import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { ChipsInputComponent } from './chips-input.component';

import { TagService } from 'src/app/_shared/services/http/tag.service';

@NgModule({
	declarations: [ChipsInputComponent],
	exports: [ChipsInputComponent],
	imports: [
		CommonModule,
    MatIconModule,
    TranslateModule
	],
  providers: [TagService]
})
export class ChipsInputModule {}
