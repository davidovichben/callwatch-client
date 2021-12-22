import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const DateAdapterConfig = [
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, strict: false } },
  { provide: MAT_DATE_LOCALE, useValue: 'he-IL' },
  {
    provide: MAT_DATE_FORMATS,
    useValue: {
      parse: {
        dateInput: [],
      },
      display: {
        dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
      },
    }
  }
]
