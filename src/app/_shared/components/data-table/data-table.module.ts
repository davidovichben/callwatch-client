import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DataTableComponent } from './data-table.component';
import { PaginationComponent } from './pagination/pagination.component';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule,
    MatSlideToggleModule, MatMenuModule, MatIconModule,
    TranslateModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatTooltipModule, MatButtonModule, MatMenuModule, MatIconModule,
    PaginationComponent,
    DataTableComponent,
  ],
  declarations: [DataTableComponent, PaginationComponent],
})
export class DataTableModule {}
