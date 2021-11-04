import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { SchedulesComponent } from './schedules.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

const routes: Routes = [
  { path: '', component: SchedulesComponent },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [SchedulesComponent],
  imports: [
    RouterModule.forChild(routes),
    MatIconModule,
    MatMenuModule,
    DataTableModule,
    TranslateModule
  ],
  providers: [ScheduleService]
})
export class SchedulesModule {}
