import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { RoutersComponent } from 'src/app/platform/settings/routers/routers.component';

import { RouterService } from 'src/app/_shared/services/http/router.service';

const routes: Routes = [
	{
		path: '',
		component: RoutersComponent
	},
	{ path: 'form', loadChildren: () => import('src/app/platform/settings/routers/form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [RoutersComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    TranslateModule
	],
	providers: [RouterService]
})
export class RoutersModule {}
