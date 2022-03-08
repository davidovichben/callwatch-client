import { Injectable } from '@angular/core';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

declare const swal: any;

@Injectable()
export class NotificationService {

  constructor(private t: TranslatePipe) {}

  public success(title?: string, text?: string, extraOptions?: object): void {
    title = title ? title : this.t.transform('action_done_successfully');
    let options = {
      position: 'center',
      icon: 'success',
      title,
      text: text ? text : '',
      confirmButtonText: this.t.transform('confirm'),
      timer: 2500
    };

    if (extraOptions) {
      options = Object.assign(options, extraOptions);
    }

    swal.fire(options);
  }

  public error(text?: string, title?: string, extraOptions?: object): void {
    let options = {
      icon: 'error',
      title: title ? title : this.t.transform('error'),
      text,
      confirmButtonText: this.t.transform('close')
    };

    if (extraOptions) {
      options = Object.assign(options, extraOptions);
    }

    swal.fire(options);
  }

  public warning(title?: string, text?: string, extraOptions?: object): Promise<any> {
    let options = {
      title: title ? title : this.t.transform('are_you_sure'),
      text: text ? text : '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.t.transform('confirm'),
      cancelButtonText: this.t.transform('cancel')
    };

    if (extraOptions) {
      options = Object.assign(options, extraOptions);
    }

    return swal.fire(options);
  }

  public info(title: string, text?: string, extraOptions?: object): Promise<any> {
    let options = {
      title,
      text: text ? text : '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel'
    };

    if (extraOptions) {
      options = Object.assign(options, extraOptions);
    }

    return swal.fire(options);
  }

  public deactivateWarning(): Promise<boolean> {
    const text = this.t.transform('form_data_lost_error');
    return this.warning(this.t.transform('warning'), text).then(confirmation => {
      return confirmation.value;
    });
  }

  public authorizationError(): void {
    return this.error(this.t.transform('authorization_error'));
  }

  public serverError(): void {
    return this.error(this.t.transform('server_error'));
  }
}
