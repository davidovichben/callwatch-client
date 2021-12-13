import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { ExtensionsComponent } from './extensions.component';

import { ExtensionService } from 'src/app/_shared/services/http/extension.service';

const routes: Routes = [
  {
    path: '',
    component: ExtensionsComponent
  },
  { path: 'form', loadChildren: () => import('../acds/form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [ExtensionsComponent],
  imports: [
    RouterModule.forChild(routes),
    DataTableModule,
    TranslateModule
  ],
  providers: [ExtensionService]
})
export class ExtensionsModule {}
