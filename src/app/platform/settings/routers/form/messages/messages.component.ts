import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { SharedComponent } from 'src/app/platform/settings/routers/form/shared/shared.component';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { RouterMessageTypes } from 'src/app/_shared/models/router-message.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.styl', '../shared/shared.component.styl']
})
export class MessagesComponent extends SharedComponent implements OnInit, OnDestroy {

  readonly messageTypes = RouterMessageTypes;

  formArray: UntypedFormArray;

  constructor(dialog: MatDialog, formService: RouterFormService, router: Router,
              private route: ActivatedRoute, private locale: LocaleService,
              private fb: UntypedFormBuilder, private notificationService: NotificationService) {
    super(dialog, router, formService);
  }

  ngOnInit(): void {
    this.sub.add(this.route.params.subscribe(params => {
      this.setLanguage();

      this.category = params.category;
      this.formArray = (this.formService.routerForm.get('messages.' + this.category) as UntypedFormArray);
      this.formService.activeGroup = 'messages.' + this.category;
    }))
  }

  pushMessage(): void {
    const message = this.formService.getMessageGroup(this.category);
    this.formArray.push(message);
  }

  dropMessage(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.formArray.value, event.previousIndex, event.currentIndex);
  }

  deleteMessage(index: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.formArray.removeAt(index);
      }
    })
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
