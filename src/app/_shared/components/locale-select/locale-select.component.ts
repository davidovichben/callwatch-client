import { Component } from '@angular/core';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';

import { Locales } from 'src/app/_shared/constants/modules';

@Component({
  selector: 'app-locale-select',
  templateUrl: './locale-select.component.html'
})
export class LocaleSelectComponent {

  readonly locales = Locales;

  constructor(public localeService: LocaleService) {}

  changeLocale(locale: string): void {
    this.localeService.setLocale(locale);
  }
}
