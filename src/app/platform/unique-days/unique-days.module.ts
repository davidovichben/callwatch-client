import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { UniqueDaysComponent } from 'src/app/platform/unique-days/unique-days.component';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

const routes: Routes = [
	{
		path: '',
		component: UniqueDaysComponent
	},
	{ path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [UniqueDaysComponent],
	imports: [
		RouterModule.forChild(routes),
    MatIconModule,
    MatMenuModule,
		DataTableModule,
    TranslateModule
	],
	providers: [UniqueDayService]
})
export class UniqueDaysModule {}
