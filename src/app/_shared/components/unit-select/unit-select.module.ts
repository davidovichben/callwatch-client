import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UnitSelectComponent } from './unit-select.component';
import { TranslateModule } from '../../pipes/translate/translate.module';
import { UnitTreeService } from '../../services/unit/unit-tree.service';
import { UnitFilterService } from '../../services/unit/unit-filter.service';
import { UnitSelectionService } from '../../services/unit/unit-selection.service';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    UnitSelectComponent
  ],
	imports: [
		CommonModule,
		FormsModule,
		MatIconModule,
		MatCheckboxModule,
		TranslateModule,
		CdkVirtualScrollViewport,
		CdkVirtualForOf,
		CdkFixedSizeVirtualScroll
	],
  exports: [
    UnitSelectComponent
  ],
  providers: [
    UnitTreeService,
    UnitFilterService,
    UnitSelectionService
  ]
})
export class UnitSelectModule { }
