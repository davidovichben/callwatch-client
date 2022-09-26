import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { MatDialogModule } from '@angular/material/dialog';

import { UniqueDaysComponent } from 'src/app/platform/settings/unique-days/unique-days.component';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

const routes: Routes = [
	{
		path: '',
		component: UniqueDaysComponent
	},
	{ path: 'form', loadChildren: () => import('src/app/platform/settings/unique-days/form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [UniqueDaysComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    TranslateModule,
    MatDialogModule
	],
	providers: [UniqueDayService]
})
export class UniqueDaysModule {}
