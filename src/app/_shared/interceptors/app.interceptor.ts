import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/internal/operators';

import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private userSession: UserSessionService,
              private notificationService: NotificationService,
              private helpers: HelpersService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const noLoader = req.headers.get('NoLoader');

    const authReq = req.clone({
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.userSession.getToken()
      })
    });

    if (noLoader) {
      return next.handle(authReq);
    }

    this.helpers.setPageSpinner(true);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.notificationService.authorizationError();
        } else {
          this.notificationService.serverError();
        }

        return throwError(error);
      }),
      finalize(() => {
        this.helpers.setPageSpinner(false);
      })
    );
  }
}
