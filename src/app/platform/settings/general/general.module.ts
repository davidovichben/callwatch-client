import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { OrganizationService } from 'src/app/_shared/services/http/organization.service';
import { OrganizationSettingsResolve } from 'src/app/_shared/resolves/organization-settings.resolve';

@NgModule({
  declarations: [
    GeneralComponent
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    OrganizationService,
    OrganizationSettingsResolve
  ]
})
export class GeneralModule { }
