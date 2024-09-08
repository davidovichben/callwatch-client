import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from 'src/app/platform/settings/mailboxes/multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { MailboxService } from 'src/app/_shared/services/http/mailbox.service';

@Component({
  selector: 'app-mailboxes',
  templateUrl: './mailboxes.component.html'
})
export class MailboxesComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

  readonly columns = [
    { label: 'name', name: 'name' },
    { label: 'unit', name: 'unit' }
  ];
  
  constructor(private notification: NotificationService,
              public userSession: UserSessionService,
              private mailboxService: MailboxService) {}
  
  async fetchItems(): Promise<void> {
    const response = await this.mailboxService.getMailboxes(this.dataTable.criteria);
    this.dataTable.setItems(response);
  }

  openMultipleEdit(): void {
    // const data = { selects: this.selects };
    // this.dataTable.openMultipleEditDialog(MultipleEditComponent, data);
  }

  async deleteItem(mailboxId: string): Promise<void> {
    const confirmation = await this.notification.warning();
    if (confirmation.value) {
      await this.mailboxService.deleteMailbox(mailboxId);
      this.notification.success();
      await this.fetchItems();
    }
  }
}
