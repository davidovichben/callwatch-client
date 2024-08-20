import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Fade } from 'src/app/_shared/constants/animations';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';
import { TranslateModule } from '../../_shared/pipes/translate/translate.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  animations: [Fade],
  imports: [RouterModule, FormsModule, MatFormFieldModule, MatInputModule, TranslateModule, CommonModule],
  providers: [AppHttpService],
  standalone: true
})
export class LoginComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  isSubmitting = false;

  hasLoginError: boolean;
  loginNotAllowed: boolean;
  showForm = false;

  constructor(private router: Router, private userSession: UserSessionService,
              private appHttp: AppHttpService, private localeService: LocaleService,
              private notificationService: NotificationService, private t: TranslatePipe) {}

  ngOnInit(): void {
    setTimeout(() => this.showForm = true, 300);
  }

  async submit(form: NgForm) {
    if (!form.valid || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    this.hasLoginError = false;

    const response = await this.appHttp.login(form.value.username, form.value.password);
    if (response.status === 500 || response.status === 0) {
      const errorMsg = this.t.transform('general_login_error');
      this.notificationService.error(errorMsg);
    } else if (response.accessToken) {
      //this.localeService.setLocale(response.language.code);
      
      this.localeService.setLocale('he');
      this.userSession.setUser(response.accessToken);
      const url = response.isAdmin ? ['/admin'] : ['/platform'];
      // window.location.reload();
      await this.router.navigate(url);
    } else {
      if (response.error?.errorCode) {
        this.loginNotAllowed = true;
      } else {
        this.hasLoginError = true;
      }
    }

    this.isSubmitting = false;
  }
}
