import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { MultipleEditModule } from 'src/app/platform/settings/extensions/multiple-edit/multiple-edit.module';

import { ExtensionsComponent } from 'src/app/platform/settings/extensions/extensions.component';

import { ExtensionService } from 'src/app/_shared/services/http/extension.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { AcdFormSelectResolve } from 'src/app/_shared/resolves/acd-form-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: ExtensionsComponent,
    resolve: { selects: AcdFormSelectResolve },
  },
  { path: 'form', loadChildren: () => import('src/app/platform/settings/extensions/form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [ExtensionsComponent],
  imports: [
    RouterModule.forChild(routes),
    DataTableModule,
    TranslateModule,
    MultipleEditModule
  ],
  providers: [ExtensionService, AcdFormSelectResolve, SelectService]
})
export class ExtensionsModule {}
