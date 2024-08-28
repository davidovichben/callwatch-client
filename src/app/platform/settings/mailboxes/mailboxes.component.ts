import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from 'src/app/platform/settings/mailboxes/multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { MailboxService } from 'src/app/_shared/services/http/mailbox.service';

@Component({
  selector: 'app-mailboxes',
  templateUrl: './mailboxes.component.html'
})
export class MailboxesComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

  readonly columns = [
    { label: 'extension_name', name: 'name' },
    { label: 'dial_number', name: 'dialNumber' },
    { label: 'extension_type', name: 'type' },
    { label: 'unit', name: 'unit' }
  ];

  selects = {
    extensions: [],
    types: [],
    switchboards: [],
    callbacks: [],
    routers: []
  };

  constructor(private notification: NotificationService,
              public userSession: UserSessionService,
              private mailboxService: MailboxService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.selects = this.route.snapshot.data.selects;
  }

  async fetchItems(): Promise<void> {
    const response = await this.mailboxService.getMailboxes(this.dataTable.criteria);
    this.dataTable.setItems(response);
  }

  openMultipleEdit(): void {
    const data = { selects: this.selects }
    this.dataTable.openMultipleEditDialog(MultipleEditComponent, data)
  }

  async deleteItem(extensionId: string): Promise<void> {
    const confirmation = await this.notification.warning();
    if (confirmation.value) {
      await this.mailboxService.deleteMailbox(extensionId);
      this.notification.success();
      this.fetchItems();
    }
  }
}
