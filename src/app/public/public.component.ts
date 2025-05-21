import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LocaleService } from '../_shared/services/state/locale.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.sass'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class PublicComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
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
