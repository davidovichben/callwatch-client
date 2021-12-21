import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { OrganizationsComponent } from './organizations.component';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';

const routes: Routes = [
  { path: '', component: OrganizationsComponent }
];

@NgModule({
  declarations: [OrganizationsComponent],
  imports: [
    RouterModule.forChild(routes),
    MatDialogModule,
    DataTableModule,
    TranslateModule
  ],
  providers: [OrganizationService]
})
export class OrganizationsModule {}
