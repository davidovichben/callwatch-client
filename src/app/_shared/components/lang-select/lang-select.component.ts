import { Component } from '@angular/core';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';

import { Langs } from 'src/app/_shared/constants/general';

@Component({
  selector: 'app-lang-select',
  templateUrl: './lang-select.component.html'
})
export class LangSelectComponent {

  readonly langs = Langs;

  constructor(public locale: LocaleService) {}

  changeLang(lang: string): void {
    this.locale.setLang(lang);
  }
}
