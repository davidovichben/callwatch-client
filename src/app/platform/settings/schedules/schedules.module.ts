import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { SchedulesComponent } from 'src/app/platform/settings/schedules/schedules.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

const routes: Routes = [
  { path: '', component: SchedulesComponent },
  { path: 'form', loadChildren: () => import('src/app/platform/settings/schedules/form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [SchedulesComponent],
  imports: [
    RouterModule.forChild(routes),
    DataTableModule,
    TranslateModule
  ],
  providers: [ScheduleService]
})
export class SchedulesModule {}
