import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TruncateModule } from 'src/app/_shared/pipes/truncate/truncate.module';

import { ExceptionsComponent } from 'src/app/admin/exceptions/exceptions.component';
import { ExceptionDialogComponent } from './exception-dialog/exception-dialog.component';

import { ExceptionsService } from 'src/app/_shared/services/http/exceptions.service';

const routes: Routes = [
  {
    path: '',
    component: ExceptionsComponent
  }
];

@NgModule({
  declarations: [
    ExceptionsComponent,
    ExceptionDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    TranslateModule,
    DataTableModule,
    TruncateModule,
    MatDialogModule
  ],
  providers: [ExceptionsService]
})
export class ExceptionsModule {}
