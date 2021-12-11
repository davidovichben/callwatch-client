import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TimingDialogComponent } from 'src/app/platform/routers/form/timing-dialog/timing-dialog.component';

import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { RouterKeyModel, RouterKeyTypes } from 'src/app/_shared/models/router-key.model';
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

  formArray: FormArray;

  constructor(private dialog: MatDialog, private helpers: HelpersService,
              private fb: FormBuilder,
              private scheduleService: ScheduleService,
              private locale: LocaleService,
              public formService: RouterFormService) {}

  ngOnInit(): void {
    this.formArray = (this.formService.routerForm.get('keys.' + this.category) as FormArray);
    if (this.formArray.length === 0) {
      this.types.slice(0, 3).forEach(type => {
        this.formArray.push(this.addKeyGroup(type));
      });
    }

    this.activeLang = this.locale.getLocale();
  }

  // ngOnInit(): void {
  //   if (this.messages) {
  //     this.setMessagesFiles();
  //   }
  // }
  //
  // private setMessagesFiles(): void {
  //   const messagesWithFiles = this.messages.filter(message => message.contentType === 'message' && Object.keys(message.files).length > 0);
  //   messagesWithFiles.forEach(message => {
  //     this.langs.forEach(iteratedLang => {
  //       const lang = iteratedLang.value;
  //       if (message.files[lang]) {
  //         message.files[lang] = this.helpers.base64toFile(message.files[lang].bin, message.files[lang].name);
  //       }
  //     })
  //   });
  // }

  setActivityName(key: RouterKeyModel, activityTypeId: number): void {
    const type = this.formService.keyActivityTypes.find(type => type.id === activityTypeId);
    key.activityTypeName = type.name;
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
      isDefault: this.fb.control(false)
    });
  }

  newKey(): void {
    const existingTypes = this.formArray.value.map(key => key.type);
    let missingKeyIndex = this.types.slice(0, this.formArray.length).findIndex(type => existingTypes.indexOf(type) === -1);
    if (missingKeyIndex !== -1) {
      const type = this.types[missingKeyIndex];
      this.formArray.setValue(this.helpers.insertAt(this.formArray.value, missingKeyIndex, this.addKeyGroup(type)));
    } else {
      const type = this.types[this.formArray.length];
      this.formArray.push(this.addKeyGroup(type));
    }
  }

  deleteKey(index: number): void {
    this.formArray.removeAt(index);
  }

  setDefault(group: FormGroup): void {
    this.formArray.controls.forEach(control => control.get('isDefault').patchValue(false));
    group.get('isDefault').patchValue(true);
  }

  setFile(key: FormGroup, file?: { bin: string, name: string }): void {
    const value = key.get('files').value;
    value[this.activeLang] = file;

    key.get('files').patchValue(value);
  }

  openActivityDialog(key: FormGroup): void {
    const dialog = this.dialog.open(TimingDialogComponent, {
      width: '800px',
      data: {
        schedules: this.formService.schedules,
        values: key.value
      }
    })

    const sub = dialog.afterClosed().subscribe(timing => {
      if (timing) {
        if (timing.type === 'schedule') {
          this.scheduleService.getSchedule(timing.schedule).then(schedule => {
            key.get('timingType').patchValue(timing.type);
            key.get('schedule').patchValue(timing.schedule);
            this.calculateMessageOnline('', '');
          });
        } else {
          key.get('timingType').patchValue(timing.type);
          key.get('startDateTime').patchValue(timing.startDateTime);
          key.get('endDateTime').patchValue(timing.endDateTime);
          this.calculateMessageOnline('', '');
        }
      }
    });

    this.sub.add(sub);
  }

  private calculateMessageOnline(a: string, b: string): void {

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
