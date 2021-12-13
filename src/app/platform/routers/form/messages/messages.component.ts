import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterMessageTypes } from 'src/app/_shared/models/router-message.model';
import { MatDialog } from '@angular/material/dialog';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';
import { SharedComponent } from 'src/app/platform/routers/form/shared/shared.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.styl', '../shared/shared.component.styl']
})
export class MessagesComponent extends SharedComponent {

  readonly messageTypes = RouterMessageTypes;

  formArray: FormArray;

  constructor(dialog: MatDialog, helpers: HelpersService,
              formService: RouterFormService, private locale: LocaleService,
              private fb: FormBuilder) {
    super(dialog, formService, helpers);
  }

  ngOnInit(): void {
    this.formArray = (this.formService.routerForm.get('messages.' + this.category) as FormArray);

    this.activeLang = this.locale.getLocale();
    if (this.formService.router && this.formArray.length > 0) {
      const groupsWithFiles = this.formArray.controls.filter(key => key.get('type').value === 'message' && key.get('files').value.length > 0);
      this.setFiles(groupsWithFiles as FormGroup[]);
    }
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
}
