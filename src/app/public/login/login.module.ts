import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { LoginComponent } from 'src/app/public/login/login.component';

import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    TranslateModule
  ],
  providers: [AppHttpService]
})
export class LoginModule {}
