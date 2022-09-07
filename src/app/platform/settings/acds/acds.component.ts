import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from 'src/app/platform/settings/acds/multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { AcdService } from 'src/app/_shared/services/http/acd.service';

@Component({
	selector: 'app-acds',
	templateUrl: './acds.component.html'
})
export class AcdsComponent implements OnInit {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

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
              public userSession: UserSessionService) {}

  ngOnInit(): void {
    this.selects = this.route.snapshot.data.selects;
  }

  fetchItems(): void {
		this.acdService.getAcds(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
	}

  openMultipleEdit(): void {
    const data = { selects: this.selects }
    this.dataTable.openMultipleEditDialog(MultipleEditComponent, data)
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
}
