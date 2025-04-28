import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { MatDialogModule } from '@angular/material/dialog';

import { KeywordsComponent } from 'src/app/platform/settings/keywords/keywords.component';

import { KeywordService } from 'src/app/_shared/services/http/keyword.service';

const routes: Routes = [
	{ path: '', component: KeywordsComponent },
	{ path: 'form', loadChildren: () => import('src/app/platform/settings/keywords/form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [KeywordsComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    TranslateModule,
    MatDialogModule
	],
	providers: [KeywordService]
})
export class KeywordsModule {}
