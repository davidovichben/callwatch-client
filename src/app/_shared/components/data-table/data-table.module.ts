import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DataTableComponent } from './data-table.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SideFiltersComponent } from './side-filters/side-filters.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatIconModule,
    MatSlideToggleModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatTooltipModule, MatButtonModule, MatIconModule,
    PaginationComponent,
    SideFiltersComponent,
    DataTableComponent,
  ],
  declarations: [DataTableComponent, PaginationComponent, SideFiltersComponent],
})
export class DataTableModule {}
