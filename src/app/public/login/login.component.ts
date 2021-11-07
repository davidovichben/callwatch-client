import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Fade } from 'src/app/_shared/constants/animations';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl'],
  animations: [Fade]
})
export class LoginComponent {

  isSubmitting = false;

  hasLoginError: boolean;

  constructor(private router: Router, private userSession: UserSessionService,
              private appHttp: AppHttpService, private localeService: LocaleService) {}

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.hasLoginError = false;

      this.appHttp.login(form.value.username, form.value.password).then(response => {
        if (response) {
          this.localeService.setLocale(response.locale);
          this.userSession.setUser(response);

          const url = response.isAdmin ? ['/admin'] : ['/platform'];
          this.router.navigate(url);
        } else {
          this.hasLoginError = true;
        }

        this.isSubmitting = false;
      })
    }
  }
}
