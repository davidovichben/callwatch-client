import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { TagsInputModule } from 'src/app/_shared/components/tags-input/tags-input.module';
import { CheckedItemsModule } from 'src/app/_shared/components/multiple-edit/checked-items/checked-items.module';

import { MultipleEditComponent } from './multiple-edit.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

@NgModule({
  declarations: [MultipleEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatSelectModule,
    TagsInputModule,
    CheckedItemsModule,
    MatCheckboxModule
  ],
  providers: [ScheduleService],
  exports: [MultipleEditComponent]
})
export class MultipleEditModule {}
