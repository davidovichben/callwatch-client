import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TimingDialogComponent } from 'src/app/platform/routers/form/timing-dialog/timing-dialog.component';

import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { Langs } from 'src/app/_shared/constants/general';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

@Component({
  selector: 'app-shared',
  template: ''
})
export abstract class SharedComponent implements OnDestroy {

  readonly sub = new Subscription();
  readonly langs = Langs;

  @Input() category: string;

  activeLang: string;

  protected constructor(private dialog: MatDialog, public formService: RouterFormService,
                        private helpers: HelpersService) {}

  protected setFiles(groupsWithFiles: FormGroup[]): void {
    groupsWithFiles.forEach(group => {
      this.langs.forEach(iteratedLang => {
        const lang = iteratedLang.value;
        if (group.get('files').value[lang]) {
          const value = group.get('files').value;
          value[lang] = this.helpers.base64toFile(value[lang].bin, value[lang].name);

          group.get('files').patchValue(value);
        }
      })
    });
  }

  setFile(group: FormGroup, file?: { bin: string, name: string }): void {
    const value = group.get('files').value;
    value[this.activeLang] = file;

    group.get('files').patchValue(value);
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
