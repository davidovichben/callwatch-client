import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    TranslateModule
  ],
  providers: [AppHttpService]
})
export class LoginModule {}
