import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PinInputComponent } from 'src/app/_shared/components/pin-input/pin-input.component';

import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  animations: [Fade]
})
export class ForgotPasswordComponent {

  @ViewChild(PinInputComponent) pinInput: PinInputComponent;

  readonly errorMessages = ErrorMessages;

  readonly errors = {
    userNotFound: false,
    invalidToken: false
  }

  status = 'unsent';

  isSubmitting = false;

  username: string;
  token: string;

  constructor(private appHttp: AppHttpService, private notifications: NotificationService) {}

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.status === 'unsent') {
        this.username = form.value.username;
        this.sendResetToken(form.value.username);
      } else {
        this.token = form.value.token;
        this.validateResetToken(form.value.token);
      }
    }
  }

  resendToken(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      this.pinInput.reset();

      this.sendResetToken(this.username);
    }
  }

  sendResetToken(username: string): void {
    this.appHttp.forgotPassword(username).then(response => {
      if (response.error) {
        if (response.error.errorCode === 1) {
          this.errors.userNotFound = true;
        } else {
          this.notifications.serverError();
        }
      } else {
        this.errors.userNotFound = false;
        this.status = 'sent';
      }

      this.isSubmitting = false;
    });
  }

  private validateResetToken(token: string): void {
    this.appHttp.checkResetToken(token).then(response => {
      if (response.error) {
        this.errors.invalidToken = true;
      } else {
        this.errors.invalidToken = false;
        this.status = 'validated';
      }

      this.isSubmitting = false;
    });
  }

  resetPassword(password: string): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;

      this.appHttp.resetPassword(password, this.username, this.token).then(response => {
        if (response) {
          this.status = 'reset';
        }

        this.isSubmitting = false;
      });
    }
  }
}
