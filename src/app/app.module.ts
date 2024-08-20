import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ChartModule } from 'src/app/_shared/components/chart/charts.module';
import { DateAdapterConfig } from 'src/app/_shared/constants/date-adapter-options';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';
import { AppStateService } from 'src/app/_shared/services/state/app-state.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { AppInterceptor } from 'src/app/_shared/interceptors/app.interceptor';

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        // NgxMatMomentModule,
        ChartModule
    ],
    providers: [
        AppStateService,
        UserSessionService,
        NotificationService,
        HelpersService,
        LocaleService,
        GenericService,
        TranslatePipe,
        { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
        { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
        { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
        { provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
        ...DateAdapterConfig,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule {}
