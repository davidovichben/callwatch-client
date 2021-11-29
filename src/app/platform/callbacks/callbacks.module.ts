import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { CallbacksComponent } from './callbacks.component';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';

const routes: Routes = [
	{
		path: '',
		component: CallbacksComponent
	},
	{ path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [CallbacksComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    TranslateModule
	],
	providers: [CallbackService]
})
export class CallbacksModule {}
