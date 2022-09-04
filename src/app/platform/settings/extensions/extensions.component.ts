import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from 'src/app/platform/settings/extensions/multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { ExtensionService } from 'src/app/_shared/services/http/extension.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.component.html'
})
export class ExtensionsComponent implements OnInit, OnDestroy {

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
              private extensionService: ExtensionService,
              public userSession: UserSessionService,
              private t: TranslatePipe,
              private dialog: MatDialog,
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
    const checkedItems = this.dataTable.criteria.checkedItems;

    if (checkedItems.length === 0) {
      this.notification.error(this.t.transform('no_items_selected'));
      return;
    }

    const dialog = this.dialog.open(MultipleEditComponent, {
      data: {
        checkedItems,
        selects: this.selects
      },
      width: '600px'
    })

    const sub = dialog.afterClosed().subscribe(updated => {
      if (updated) {
        this.fetchItems();
        this.dataTable.criteria.checkedItems = [];
        this.notification.success()
      }
    });

    this.sub.add(sub);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
