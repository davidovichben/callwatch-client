import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslationModel } from 'src/app/_shared/models/translation.model';

@Injectable()
export class LocaleService {

  activeLang: string;
  dir: 'rtl' | 'ltr';

  langChanged: Subject<string> = new Subject();
  translationLoaded: Subject<boolean> = new Subject();

  constructor() {
    this.activeLang = this.getLang();
    this.dir = this.activeLang === 'en' ? 'ltr' : 'rtl';
  }

  getLang(): string {
    return localStorage.getItem('lang');
  }

  setLang(lang?: string): void {
    this.activeLang = lang ? lang : 'he';
    this.dir = this.activeLang === 'en' ? 'ltr' : 'rtl';

    localStorage.removeItem('lang');
    localStorage.setItem('lang', this.activeLang);

    this.langChanged.next(this.activeLang);
  }

  getTranslations(): TranslationModel[] {
    if (localStorage.getItem('translations')) {
      return JSON.parse(localStorage.getItem('translations'));
    }

    return [];
  }

  setTranslations(translations: TranslationModel[]): void {
    const keyed = {};

    translations.forEach(row => keyed[row.key] = row.value);

    localStorage.setItem('translations', JSON.stringify(keyed));
    this.translationLoaded.next(true);
  }
}
