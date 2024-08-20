import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.sass'],
  imports: [CommonModule, RouterModule],
  standalone: true
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
