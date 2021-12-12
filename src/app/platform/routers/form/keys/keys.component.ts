import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TimingDialogComponent } from 'src/app/platform/routers/form/timing-dialog/timing-dialog.component';

import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { RouterKeyTypes } from 'src/app/_shared/models/router-key.model';
import { Langs } from 'src/app/_shared/constants/general';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.styl']
})
export class KeysComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();
  readonly types = RouterKeyTypes;
  readonly langs = Langs;

  @Input() category: string;

  activeLang;
  unusedTypes = [];

  formGroup: FormGroup;

  constructor(private dialog: MatDialog, private helpers: HelpersService,
              private fb: FormBuilder,
              private scheduleService: ScheduleService,
              private locale: LocaleService,
              public formService: RouterFormService) {}

  ngOnInit(): void {
    this.formGroup = (this.formService.routerForm.get('keys.' + this.category) as FormGroup);
    if (this.getKeysLength() === 0) {
      this.types.slice(0, 3).forEach(type => {
        const arr = this.fb.array([this.addKeyGroup(type)]);
        this.formGroup.addControl(type, arr);
      });
    } else {
      this.setFiles();
    }

    this.setUnusedTypes();
    this.activeLang = this.locale.getLocale();
  }

  getKeys(): string[] {
    return Object.keys(this.formGroup.controls);
  }

  getKeysLength(): number {
    return Object.keys(this.formGroup.controls).length;
  }

  private setFiles(): void {
    // const keysWithFiles = this.formArray.controls.filter(key => key.get('activityType').value === 'audio_message' && key.get('files').value.length > 0);
    // keysWithFiles.forEach(key => {
    //   this.langs.forEach(iteratedLang => {
    //     const lang = iteratedLang.value;
    //     if (key.get('files').value[lang]) {
    //       const value = key.get('files').value;
    //       value[lang] = this.helpers.base64toFile(value[lang].bin, value[lang].name);
    //
    //       key.get('files').patchValue(value);
    //     }
    //   })
    // });
  }

  setActivityName(key: FormGroup, activityTypeId: number): void {
    const type = this.formService.keyActivityTypes.find(type => type.id === activityTypeId);
    key.get('activityTypeName').patchValue(type.name);
  }

  addKeyGroup(type: string): FormGroup {
    return this.fb.group({
      category: this.fb.control(this.category),
      type: this.fb.control(type),
      activityType: this.fb.control(null),
      activityValue: this.fb.control(null),
      activityTypeName: this.fb.control(null),
      files: this.fb.control({}),
      router: this.fb.control(null),
      documenting: this.fb.control(null),
      timingType: this.fb.control(null),
      schedule: this.fb.control(null),
      startDateTime: this.fb.control(null),
      endDateTime: this.fb.control(null),
      isActive: this.fb.control(true),
      isDefault: this.fb.control(false),
      isOnline: this.fb.control(true),
      callTimes: this.fb.control(null)
    });
  }

  newKey(type: string): void {
    if (!type) {
      return;
    }

    const arr = this.fb.array([this.addKeyGroup(type)]);
    this.formGroup.addControl(type, arr);

    this.setUnusedTypes();
  }

  deleteAction(type: string, index: number): void {
    const arr = (this.formGroup.get(type) as FormArray);
    arr.removeAt(index);
    if (arr.length === 0) {
      this.formGroup.removeControl(type);
      this.setUnusedTypes();
    }
  }

  setDefault(group: FormGroup): void {
    this.getKeys().forEach(key => {
      (this.formGroup.get(key) as FormArray).at(0).patchValue(false);
    })
    group.get('isDefault').patchValue(true);
  }

  setFile(key: FormGroup, file?: { bin: string, name: string }): void {
    const value = key.get('files').value;
    value[this.activeLang] = file;

    key.get('files').patchValue(value);
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
        if (timing.type === 'schedule') {
          this.scheduleService.getSchedule(timing.schedule).then(schedule => {
            formGroup.get('timingType').patchValue(timing.type);
            formGroup.get('schedule').patchValue(timing.schedule);

            // const activeCallTimes = schedule.callTimes.filter(callTime => callTime.isActive);
            // formGroup.get('callTimes').patchValue(activeCallTimes);
            // this.checkOnline(formGroup);
          });
        } else {
          formGroup.get('timingType').patchValue(timing.type);
          formGroup.get('startDateTime').patchValue(timing.startDateTime);
          formGroup.get('endDateTime').patchValue(timing.endDateTime);

          // this.checkOnline(formGroup);
        }
      }
    });

    this.sub.add(sub);
  }

  checkOnline(formGroup: FormGroup): void {
    if (!formGroup.get('isActive').value) {
      formGroup.get('isOnline').patchValue(false);
      return;
    }
    //
    // const now = moment();
    // let isOnline = false;
    //
    // console.log(now.weekday())
    //
    // switch (formGroup.get('timingType').value) {
    //   case 'schedule':
    //     formGroup.get('callTimes').value.forEach(callTime => {
    //       isOnline = now.weekday() !== callTime.dayNumber;
    //     })
    //     break;
    //   case 'timed':
    //
    // }
    //
    // formGroup.get('isOnline').patchValue(isOnline);
  }

  private setUnusedTypes(): void {
    this.unusedTypes = this.types.filter(type => !this.getKeys().includes(type));
  }

  addAction(type: string): void {
    (this.formGroup.get(type) as FormArray).push(this.addKeyGroup(type));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
