import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from 'src/app/admin/organizations/form/form.component';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';

import { OrganizationResolve } from 'src/app/_shared/resolves/organization.resolve';

const routes: Routes = [
  {
    path: '',
    component: FormComponent
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      organization: OrganizationResolve
    }
  }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  providers: [OrganizationService, OrganizationResolve]
})
export class FormModule {}
