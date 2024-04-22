import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ChartModule } from 'src/app/_shared/components/chart/charts.module';

import { MAT_LEGACY_RADIO_DEFAULT_OPTIONS as MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/legacy-radio';
import { MAT_LEGACY_SLIDE_TOGGLE_DEFAULT_OPTIONS as MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/legacy-slide-toggle';
import { MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS, MatLegacyFormFieldDefaultOptions as MatFormFieldDefaultOptions } from '@angular/material/legacy-form-field';
import { MAT_LEGACY_CHECKBOX_DEFAULT_OPTIONS as MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/legacy-checkbox';
import { DateAdapterConfig } from 'src/app/_shared/constants/date-adapter-options';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';
import { AppStateService } from 'src/app/_shared/services/state/app-state.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { LoggedInGuard } from 'src/app/_shared/guards/logged-in.guard';
import { GuestGuard } from 'src/app/_shared/guards/guest.guard';

import { AppInterceptor } from 'src/app/_shared/interceptors/app.interceptor';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMomentDateModule,
    NgxMatMomentModule,
    ChartModule
  ],
  providers: [
    AppStateService,
    UserSessionService,
    NotificationService,
    HelpersService,
    LocaleService,
    GenericService,
    GuestGuard,
    LoggedInGuard,
    TranslatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    ...DateAdapterConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

