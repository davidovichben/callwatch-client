import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterMessageModel, RouterMessageTypes } from 'src/app/_shared/models/router-message.model';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { MessageTimingComponent } from './message-timing/message-timing.component';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
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

  @Input() type: string;
  @Input() routers: SelectItemModel[];
  @Input() schedules: SelectItemModel[];

  @Input() messages = [];

  @Output() messageDeleted = new EventEmitter();

  activeLang;

  constructor(private dialog: MatDialog, private locale: LocaleService,
              private scheduleService: ScheduleService,
              private helpers: HelpersService,
              private t: TranslatePipe) {}

  ngOnInit(): void {
    this.activeLang = this.locale.getLocale();
    if (this.messages) {
      this.setMessagesFiles();
    }
  }

  private setMessagesFiles(): void {
    const messagesWithFiles = this.messages.filter(message => message.contentType === 'message' && Object.keys(message.files).length > 0);
    console.log(messagesWithFiles)
    messagesWithFiles.forEach(message => {
      this.langs.forEach(iteratedLang => {
        const lang = iteratedLang.value;
        if (message.files[lang]) {
          message.files[lang] = this.helpers.base64toFile(message.files[lang].bin, message.files[lang].name);
        }
      })
    });
  }

  setFile(index: number, file?: { bin: string, name: string }): void {
    this.messages[index].files[this.activeLang] = file;
  }

  openActivityDialog(message: RouterMessageModel): void {
    const dialog = this.dialog.open(MessageTimingComponent, {
      width: '800px',
      data: {
        schedules: this.schedules,
        message: message
      }
    })

    const sub = dialog.afterClosed().subscribe(timing => {
      if (timing) {
        if (timing.type === 'schedule') {
          this.scheduleService.getSchedule(timing.schedule).then(schedule => {
            message.timingType = timing.type;
            message.schedule = timing.schedule;
            this.calculateMessageOnline('', '');
          });
        } else {
          message.timingType = timing.type;
          message.startDateTime = timing.startDateTime;
          message.endDateTime = timing.endDateTime;
          this.calculateMessageOnline('', '');
        }
      }
    });

    this.sub.add(sub);
  }

  private calculateMessageOnline(startDateTime: string, endDateTime: string): void {

  }

  dropMessage(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.messages, event.previousIndex, event.currentIndex);
  }

  newMessage(): void {
    this.messages.push(new RouterMessageModel(this.type));
  }

  deleteMessage(index: number): void {
    this.messages.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
