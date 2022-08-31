import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { MultipleEditModule } from 'src/app/platform/settings/schedules/multiple-edit/multiple-edit.module';

import { SchedulesComponent } from 'src/app/platform/settings/schedules/schedules.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { UniqueScheduleSelectResolve } from 'src/app/_shared/resolves/unique-schedules-select.resolve';

const routes: Routes = [
  {
    path: '', component: SchedulesComponent,
    resolve: { uniqueSchedules: UniqueScheduleSelectResolve }
  },
  { path: 'form', loadChildren: () => import('src/app/platform/settings/schedules/form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [SchedulesComponent],
  imports: [
    RouterModule.forChild(routes),
    DataTableModule,
    TranslateModule,
    MultipleEditModule
  ],
  providers: [ScheduleService, UniqueScheduleSelectResolve, SelectService]
})
export class SchedulesModule {}
