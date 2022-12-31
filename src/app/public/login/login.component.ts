import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Fade } from 'src/app/_shared/constants/animations';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl'],
  animations: [Fade]
})
export class LoginComponent {

  readonly errorMessages = ErrorMessages;

  isSubmitting = false;

  hasLoginError: boolean;
  loginNotAllowed: boolean;

  constructor(private router: Router, private userSession: UserSessionService,
              private appHttp: AppHttpService, private localeService: LocaleService,
              private notificationService: NotificationService) {}

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.hasLoginError = false;

      this.appHttp.login(form.value.username, form.value.password).then(response => {
        if (response.status === 500) {
          this.notificationService.error('server error');
          return;
        }

        if (response.token) {
          this.localeService.setLocale(response.language.code);
          this.userSession.setUser({ extension: form.value.extension, ...response });
          const url = response.isAdmin ? ['/admin'] : ['/platform'];
          window.location.reload();
          this.router.navigate(url);
        } else {
          if (response.error?.errorCode) {
            this.loginNotAllowed = true;
          } else {
            this.hasLoginError = true;
          }
        }

        this.isSubmitting = false;
      })
    }
  }
}
