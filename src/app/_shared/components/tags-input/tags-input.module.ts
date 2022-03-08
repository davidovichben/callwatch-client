import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { TagsInputComponent } from './tags-input.component';

import { TagService } from 'src/app/_shared/services/http/tag.service';

@NgModule({
	declarations: [TagsInputComponent],
	exports: [TagsInputComponent],
	imports: [
		CommonModule,
    MatIconModule,
    TranslateModule
	],
  providers: [TagService]
})
export class TagsInputModule {}
