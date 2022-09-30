import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TimingDialogComponent } from 'src/app/platform/settings/routers/form/timing-dialog/timing-dialog.component';

import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

@Component({
  selector: 'app-shared',
  template: ''
})
export abstract class SharedComponent implements OnDestroy {

  readonly sub = new Subscription();

  category: string;

  languages = [];
  activeLang: string;

  protected constructor(private dialog: MatDialog, protected router: Router,
                        public formService: RouterFormService) {}

  setLanguage(): void {
    this.languages = this.formService.languages;
    this.activeLang = this.languages[0].id;
  }

  setFile(group: FormGroup, file: { bin: string, name: string }, formControlName = 'files'): void {
    let value = group.get(formControlName).value;
    if (!value) {
      value = {};
    }

    value[this.activeLang] = file;

    group.get(formControlName).patchValue(value);
  }

  openActivityDialog(formGroup: FormGroup): void {
    const dialog = this.dialog.open(TimingDialogComponent, {
      width: '800px',
      data: {
        schedules: this.formService.schedules,
        values: formGroup.value
      }
    })

    const sub = dialog.afterClosed().subscribe(timing => {
      if (timing) {
        formGroup.patchValue(timing);
      }
    });

    this.sub.add(sub);
  }

  checkOnline(formGroup: FormGroup): void {
    if (!formGroup.get('isActive').value) {
      formGroup.get('isOnline').patchValue(false);
      return;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
