import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { AcdsComponent } from 'src/app/platform/settings/acds/acds.component';

import { AcdService } from 'src/app/_shared/services/http/acd.service';

const routes: Routes = [
	{
		path: '',
		component: AcdsComponent
	},
	{ path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [AcdsComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    TranslateModule
	],
	providers: [AcdService]
})
export class AcdsModule {}
