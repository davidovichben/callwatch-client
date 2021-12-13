import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { ExtensionService } from 'src/app/_shared/services/http/extension.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.component.html'
})
export class ExtensionsComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'extension_name', name: 'name' },
    // { label: 'dial_numbers', name: 'dialNumber' },
    { label: 'extension_type', name: 'type' },
    { label: 'unit', name: 'unit' }
  ];

  constructor(private notification: NotificationService,
              private extensionService: ExtensionService,
              public userSession: UserSessionService) {}

  fetchItems(): void {
    this.extensionService.getExtensions(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  deleteItem(extensionId: number): void {
    this.notification.warning().then(confirmation => {
      if (confirmation.value) {
        this.extensionService.deleteExtension(extensionId).then(() => {
          this.notification.success();
          this.fetchItems();
        });
      }
    });
  }
}
