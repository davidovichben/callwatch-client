import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';

import { LoggedInGuard } from 'src/app/_shared/guards/logged-in.guard';
import { GuestGuard } from 'src/app/_shared/guards/guest.guard';

import { AppInterceptor } from 'src/app/_shared/interceptors/app.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    UserSessionService,
    NotificationService,
    HelpersService,
    LocaleService,
    AppHttpService,
    GuestGuard,
    LoggedInGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
