import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, ChildActivationStart } from '@angular/router';

import { Fade } from 'src/app/_shared/constants/animations';

import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';

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
              private helpers: HelpersService,
              private appHttp: AppHttpService,
              public localeService: LocaleService) {}

  ngOnInit() {
    this.setSubscriptions();
    this.setLocale();
    this.listenRouterEvents();
  }

  private setLocale(): void {
    this.locale = this.localeService.getLocale();
    if (this.locale) {
      this.setDirection();

      this.appHttp.getTranslations(this.locale).then(response => {
        this.localeService.setTranslations(response);
      })
    } else {
      this.localeService.setLocale();
    }
  }

  private setSubscriptions(): void {
    this.localeService.localeChanged.subscribe(locale => {
      this.locale = locale;

      this.setDirection();

      this.appHttp.getTranslations(this.locale).then(response => {
        this.localeService.setTranslations(response);
      })
    })

    this.helpers.pageSpinnerShown.subscribe(showSpinner => this.isLoading = showSpinner);
  }

  private setDirection(): void {
    this.renderer.addClass(document.body, this.localeService.dir);
    this.renderer.removeClass(document.body, this.localeService.dir === 'rtl' ? 'ltr' : 'rtl');
    this.renderer.setAttribute(document.body, 'dir', this.localeService.dir);
  }

  private listenRouterEvents(): void {
    this.router.events.forEach(event => {
      if (event instanceof ChildActivationStart) {
        this.isLoading = true;
      }

      if (event instanceof NavigationEnd) {
        this.isLoading = false;
        this.helpers.urlChanged.next(event.urlAfterRedirects);
        window.scrollTo(0, 0);
      }
    });
  }
}
