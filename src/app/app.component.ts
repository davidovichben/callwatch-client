import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, ChildActivationStart } from '@angular/router';

import { Fade } from 'src/app/_shared/constants/animations';

import { GenericService } from 'src/app/_shared/services/http/generic.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { AppStateService } from 'src/app/_shared/services/state/app-state.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`.overlay { position: fixed }`],
  animations: [Fade]
})
export class AppComponent implements OnInit {

  locale: string;

  isLoading = false;

  constructor(private router: Router, private renderer: Renderer2,
              private genericService: GenericService, private appState: AppStateService,
              public localeService: LocaleService, private dateAdapter: DateAdapter<Date>) {}
  ngOnInit() {
    this.setSubscriptions();
    this.setLocale();
    this.listenRouterEvents();
  }

  private setLocale(): void {
    this.locale = this.localeService.getLocale();

    this.dateAdapter.setLocale('he-IL');

    if (this.locale) {
      this.setDirection();

      const translations = this.localeService.getTranslations();
      if (translations.length === 0) {
        this.genericService.getTranslations(this.locale).then(response => {
          this.localeService.setTranslations(response);
        })
      }
    } else {
      this.localeService.setLocale();
    }
  }

  private setSubscriptions(): void {
    this.localeService.localeChanged.subscribe(locale => {
      this.locale = locale;

      this.setDirection();

      this.genericService.getTranslations(this.locale).then(response => {
        this.localeService.setTranslations(response);
      })
    })

    this.appState.pageSpinnerShown.subscribe(showSpinner => this.isLoading = showSpinner);
  }

  private setDirection(): void {
    this.renderer.addClass(document.body, this.localeService.dir);
    this.renderer.removeClass(document.body, this.localeService.dir === 'rtl' ? 'ltr' : 'rtl');
    this.renderer.setAttribute(document.body, 'dir', this.localeService.dir);
  }

  private listenRouterEvents(): void {
    this.router.events.forEach(event => {
      if (event instanceof ChildActivationStart) {
        this.appState.previousUrl = this.router.url;
        this.isLoading = true;
      }

      if (event instanceof NavigationEnd) {
        this.isLoading = false;
        this.appState.urlChanged.next(event.urlAfterRedirects);

        if (!this.appState.routeScrollDisabled) {
          window.scrollTo(0, 0);
        }
      }
    });
  }
}
