import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DataTableComponent } from './data-table.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule,
    MatSlideToggleModule,
    TranslateModule, MatIconModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatTooltipModule, MatButtonModule,
    PaginationComponent,
    DataTableComponent,
  ],
  declarations: [DataTableComponent, PaginationComponent],
})
export class DataTableModule {}
