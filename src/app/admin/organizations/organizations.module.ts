import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { OrganizationsComponent } from './organizations.component';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

const routes: Routes = [
  {
    path: '',
    component: OrganizationsComponent
  },
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then(m => m.FormModule)
  }
];

@NgModule({
  declarations: [OrganizationsComponent],
  imports: [
    RouterModule.forChild(routes),
    DataTableModule,
    TranslateModule,
    MatDialogModule
  ],
  providers: [OrganizationService]
})
export class OrganizationsModule {}
