import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { FormComponent } from './form.component';

import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { MailServerResolve } from 'src/app/_shared/resolves/mail-server.resolve';
import { UnitsSelectResolve } from 'src/app/_shared/resolves/units-select.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      units: UnitsSelectResolve
    },
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      mailServer: MailServerResolve,
      units: UnitsSelectResolve
    },
    canDeactivate: [DeactivateGuard]
  }
];
