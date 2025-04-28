import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { TranslationModel } from 'src/app/_shared/models/translation.model';

@Injectable()
export class LocaleService {

  activeLocale: string;
  dir: 'rtl' | 'ltr';

  userId: string;

  localeChanged: Subject<string> = new Subject();
  translationLoaded: Subject<boolean> = new Subject();

  showTranslationKeys = false;

  constructor(private userService: UserSessionService) {
    this.activeLocale = this.getLocale();
    this.userId = this.userService.getUserId();
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
    const translations = localStorage.getItem('translations');
    // if (translations) {
      // const translationsByUser = JSON.parse(translations)[this.userId];
      //
      // if (translationsByUser) {
      //   return translationsByUser;
      // }
    // }
    
    //return [];
    
    return translations ? JSON.parse(translations) : [];
  }

  setTranslations(translations: TranslationModel[]): void {
    const keyed = {};
    // const keyedByUser = {};
    
    translations.forEach(row => keyed[row.keyName] = row.value);

    // keyedByUser[this.userId] = keyed;

    // localStorage.setItem('translations', JSON.stringify(keyedByUser));
    
    localStorage.setItem('translations', JSON.stringify(keyed));
    
    this.translationLoaded.next(true);
  }
}
