import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { SharedComponent } from 'src/app/platform/routers/form/shared/shared.component';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { RouterMessageTypes } from 'src/app/_shared/models/router-message.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.styl', '../shared/shared.component.styl']
})
export class MessagesComponent extends SharedComponent {

  readonly messageTypes = RouterMessageTypes;

  formArray: FormArray;

  constructor(dialog: MatDialog, formService: RouterFormService,
              private locale: LocaleService, private fb: FormBuilder,
              private notificationService: NotificationService) {
    super(dialog, formService);
  }

  ngOnInit(): void {
    this.formArray = (this.formService.routerForm.get('messages.' + this.category) as FormArray);
    this.activeLang = this.locale.getLocale();

    const router = this.formService.router;
    if (router?.messages && router.messages[this.category]) {
      const messages = router.messages[this.category];

      messages.forEach(message => {
        const group = this.getMessageGroup;
        group.patchValue(message);
        this.checkOnline(group);
        this.formArray.push(message);
      });
    }
  }

  private get getMessageGroup(): FormGroup {
    return this.fb.group({
      category: this.fb.control(this.category),
      type: this.fb.control('message'),
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
  }

  pushMessage(): void {
    const message = this.getMessageGroup;
    this.formArray.push(message);
  }

  dropMessage(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
  }

  deleteMessage(index: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.formArray.removeAt(index);
      }
    })
  }
}
