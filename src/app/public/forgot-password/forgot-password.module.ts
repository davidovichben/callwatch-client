import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { PinInputModule } from 'src/app/_shared/components/pin-input/pin-input.module';
import { SetPasswordModule } from 'src/app/_shared/components/set-password/set-password.module';

import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [
  { path: '', component: ForgotPasswordComponent }
];

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    TranslateModule,
    PinInputModule,
    SetPasswordModule
  ]
})
export class ForgotPasswordModule {}
