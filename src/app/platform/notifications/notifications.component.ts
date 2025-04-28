import { Component, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';

import { DataTableModule } from '../../_shared/components/data-table/data-table.module';
import { TranslateModule } from '../../_shared/pipes/translate/translate.module';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { NotificationService } from '../../_shared/services/http/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  imports: [
    NgForOf,
    DataTableModule,
    TranslateModule,
  ],
  providers: [NotificationService],
  standalone: true
})
export class NotificationsComponent {
  
  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;
  
  readonly columns = [
    { label: 'mailbox', name: 'mailbox' },
    { label: 'keyword', name: 'keyword' },
    { label: 'date', name: 'createdAt' },
  ];
  
  constructor(private notificationService: NotificationService) {}
  
  async fetchItems(): Promise<void> {
    const response = await this.notificationService.getNotifications(this.dataTable.criteria);
    
    this.dataTable.setItems(response);
  }
}
