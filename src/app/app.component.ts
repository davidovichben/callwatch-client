import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';

import { fade } from 'src/app/_shared/constants/animations';

import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [fade]
})
export class AppComponent implements OnInit {

  lang: string;

  isLoading = false;

  constructor(private router: Router, private renderer: Renderer2,
              private helpers: HelpersService,
              private appHttp: AppHttpService,
              public locale: LocaleService) {}

  ngOnInit() {
    this.setLocale();
    this.setSubscriptions();
    this.listenRouterEvents();
  }

  private setLocale(): void {
    this.lang = this.locale.getLang();
    if (this.lang) {
      this.renderer.addClass(document.body, this.locale.dir);
      this.renderer.setAttribute(document.body, 'dir', 'rtl');

      this.appHttp.getTranslations(this.lang).then(response => {
        this.locale.setTranslations(response);
      })
    } else {
      this.locale.setLang();
    }
  }

  private setSubscriptions(): void {
    this.locale.langChanged.subscribe(lang => {
      this.lang = lang;
      this.renderer.addClass(document.body, this.locale.dir);
      this.renderer.setAttribute(document.body, 'dir', 'rtl');

      this.appHttp.getTranslations(this.lang).then(response => {
        this.locale.setTranslations(response);
      })
    })

    this.helpers.pageSpinnerShown.subscribe(showSpinner => this.isLoading = showSpinner);
  }

  private listenRouterEvents(): void {
    this.router.events.forEach(event => {
      if (event instanceof NavigationStart) {
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
