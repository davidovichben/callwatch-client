import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

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
