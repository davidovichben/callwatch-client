import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { CommonModule } from '@angular/common';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { LoginComponent } from 'src/app/public/login/login.component';

import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    CommonModule
  ],
  providers: [AppHttpService]
})
export class LoginModule {}
