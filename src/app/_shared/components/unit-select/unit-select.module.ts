import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { UnitSelectComponent } from './unit-select.component';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@NgModule({
  declarations: [UnitSelectComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    TranslateModule,
    MatChipsModule,
    ScrollingModule,
    CdkScrollableModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  exports: [UnitSelectComponent],
  providers: [UnitService, TranslatePipe]
})
export class UnitSelectModule {}
