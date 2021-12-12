import { Component, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterMessageTypes } from 'src/app/_shared/models/router-message.model';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TimingDialogComponent } from 'src/app/platform/routers/form/timing-dialog/timing-dialog.component';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { Langs } from 'src/app/_shared/constants/general';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.styl']
})
export class MessagesComponent implements OnDestroy {

  readonly sub = new Subscription();
  readonly langs = Langs;
  readonly messageTypes = RouterMessageTypes;

  @Input() category: string;

  activeLang;

  formArray: FormArray;

  constructor(private dialog: MatDialog, private locale: LocaleService,
              private fb: FormBuilder,
              private scheduleService: ScheduleService,
              private helpers: HelpersService,
              public formService: RouterFormService) {}

  ngOnInit(): void {
    this.formArray = (this.formService.routerForm.get('messages.' + this.category) as FormArray);

    this.activeLang = this.locale.getLocale();
    if (this.formService.router && this.formArray.length > 0) {
      this.setFiles();
    }
  }

  private setFiles(): void {
    const messagesWithFiles = this.formArray.controls.filter(message => message.get('type').value === 'message' && message.get('files').value.length > 0);
    messagesWithFiles.forEach(message => {
      this.langs.forEach(iteratedLang => {
        const lang = iteratedLang.value;
        if (message.get('files').value[lang]) {
          const value = message.get('files').value;
          value[lang] = this.helpers.base64toFile(value[lang].bin, value[lang].name);

          message.get('files').patchValue(value);
        }
      })
    });
  }

  setFile(message: FormGroup, file?: { bin: string, name: string }): void {
    const value = message.get('files').value;
    message[this.activeLang] = file;

    message.get('files').patchValue(value);
  }

  openActivityDialog(message: FormGroup): void {
    const dialog = this.dialog.open(TimingDialogComponent, {
      width: '800px',
      data: {
        schedules: this.formService.schedules,
        values: message.value
      }
    })

    const sub = dialog.afterClosed().subscribe(timing => {
      if (timing) {
        if (timing.type === 'schedule') {
          this.scheduleService.getSchedule(timing.schedule).then(schedule => {
            message.get('timingType').patchValue(timing.type);
            message.get('schedule').patchValue(timing.schedule);
            this.calculateMessageOnline('', '');
          });
        } else {
          message.get('timingType').patchValue(timing.type);
          message.get('startDateTime').patchValue(timing.startDateTime);
          message.get('endDateTime').patchValue(timing.endDateTime);
          this.calculateMessageOnline('', '');
        }
      }
    });

    this.sub.add(sub);
  }

  private calculateMessageOnline(startDateTime: string, endDateTime: string): void {

  }

  dropMessage(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
  }

  newMessage(): void {
    const message = this.fb.group({
      category: this.fb.control(this.category),
      type: this.fb.control(null),
      description: this.fb.control(null),
      tags: this.fb.control(null),
      files: this.fb.control({}),
      router: this.fb.control(null),
      timingType: this.fb.control(null),
      schedule: this.fb.control(null),
      startDateTime: this.fb.control(null),
      endDateTime: this.fb.control(null),
      isActive: this.fb.control(true),
      isOnline: this.fb.control(true),
      callTimes: this.fb.control(null)
    });

    this.formArray.push(message);
  }

  deleteMessage(index: number): void {
    this.formArray.removeAt(index);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
