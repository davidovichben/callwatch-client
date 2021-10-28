import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { FormModule } from './form/form.module';

import { SchedulesComponent } from './schedules.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

const routes: Routes = [
  { path: '', component: SchedulesComponent }
];

@NgModule({
  declarations: [SchedulesComponent],
  imports: [
    RouterModule.forChild(routes),
    MatIconModule,
    MatDialogModule,
    DataTableModule,
    TranslateModule,
    FormModule
  ],
  providers: [ScheduleService]
})
export class SchedulesModule {}
