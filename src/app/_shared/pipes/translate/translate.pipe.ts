import { Pipe, PipeTransform } from '@angular/core';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';

import { TranslationModel } from 'src/app/_shared/models/translation.model';

@Pipe({
  name: 't',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private translations: TranslationModel[] = [];

  constructor(protected localeService: LocaleService) {
    this.translations = this.localeService.getTranslations();
    this.localeService.translationLoaded.subscribe(() => {
      this.translations = this.localeService.getTranslations();
    });
  }

  transform(key: string) {
    if (this.localeService.showTranslationKeys) {
      return this.translations[key.toLowerCase()] + ' (' + key + ')';
    }

    return this.translations[key.toLowerCase()] || key;
  }
}
