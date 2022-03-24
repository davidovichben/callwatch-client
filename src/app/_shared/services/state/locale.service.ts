import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslationModel } from 'src/app/_shared/models/translation.model';

@Injectable()
export class LocaleService {

  activeLocale: string;
  dir: 'rtl' | 'ltr';

  localeChanged: Subject<string> = new Subject();
  translationLoaded: Subject<boolean> = new Subject();

  constructor() {
    this.activeLocale = this.getLocale();
    this.dir = this.activeLocale === 'en' ? 'ltr' : 'rtl';
  }

  getLocale(): string {
    return localStorage.getItem('locale');
  }

  setLocale(locale?: string): void {
    this.activeLocale = locale ? locale : 'he';
    this.dir = this.activeLocale === 'he' ? 'rtl' : 'ltr';

    localStorage.removeItem('locale');
    localStorage.setItem('locale', this.activeLocale);

    this.localeChanged.next(this.activeLocale);
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
