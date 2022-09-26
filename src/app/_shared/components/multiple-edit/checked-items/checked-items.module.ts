import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { TruncateModule } from 'src/app/_shared/pipes/truncate/truncate.module';

import { CheckedItemsComponent } from './checked-items.component';

@NgModule({
  declarations: [CheckedItemsComponent],
  exports: [CheckedItemsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    TruncateModule
  ]
})
export class CheckedItemsModule {}
