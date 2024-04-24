import { Component } from '@angular/core';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.sass']
})
export class PublicComponent {

  activeLocale: string;

  constructor(public localeService: LocaleService) {}

  ngOnInit(): void {
    this.activeLocale = this.localeService.getLocale();
  }

  switchLocale(): void {
    const locale = this.activeLocale === 'he' ? 'en' : 'he';
    this.localeService.setLocale(locale);
    this.activeLocale = locale;
  }
}
