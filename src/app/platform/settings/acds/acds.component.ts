import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from 'src/app/platform/settings/acds/multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { AcdService } from 'src/app/_shared/services/http/acd.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
	selector: 'app-acds',
	templateUrl: './acds.component.html'
})
export class AcdsComponent implements OnInit, OnDestroy {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

  readonly columns = [
    { label: 'group_name', name: 'name' },
    { label: 'group_number', name: 'number' },
    { label: 'group_type', name: 'type' },
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
              private route: ActivatedRoute,
              private acdService: AcdService,
              public userSession: UserSessionService,
              private t: TranslatePipe,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.selects = this.route.snapshot.data.selects;
  }

  fetchItems(): void {
		this.acdService.getAcds(this.dataTable.criteria).then(response => {
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
      width: '700px'
    })

    const sub = dialog.afterClosed().subscribe(updated => {
      if (updated) {
        this.fetchItems();
        this.notification.success();
      }

      this.dataTable.criteria.checkedItems = [];
    });

    this.sub.add(sub);
  }

	deleteItem(acdId: number): void {
		this.notification.warning().then(confirmation => {
			if (confirmation.value) {
				this.acdService.deleteAcd(acdId).then(() => {
					this.notification.success();
					this.fetchItems();
				});
			}
		});
	}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
