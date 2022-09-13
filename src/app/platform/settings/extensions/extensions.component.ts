import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from 'src/app/platform/settings/extensions/multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { ExtensionService } from 'src/app/_shared/services/http/extension.service';

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.component.html'
})
export class ExtensionsComponent implements OnInit {

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
              private extensionService: ExtensionService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.selects = this.route.snapshot.data.selects;
  }

  fetchItems(): void {
    this.extensionService.getExtensions(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  openMultipleEdit(): void {
    const data = { selects: this.selects }
    this.dataTable.openMultipleEditDialog(MultipleEditComponent, data)
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
