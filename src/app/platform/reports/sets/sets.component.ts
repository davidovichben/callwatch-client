import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { FormComponent } from './form/form.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { ReportSetModel } from 'src/app/_shared/models/report-set.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html'
})
export class SetsComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'set_name', name: 'name' },
    { label: 'total_report_types', name: 'totalReportTypes' }
  ];

  reportTypes: SelectItemModel[] = [];

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private reportSetService: ReportSetService,
              private notificationService: NotificationService,
              private t: TranslatePipe) {}

  ngOnInit() {
    this.reportTypes = this.route.snapshot.data.types;
  }

  fetchItems(): void {
    this.reportSetService.getReportSets(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  editReportSet(reportSetId: number): void {
    this.reportSetService.getReportSet(reportSetId).then(response => {
      this.openFormDialog(response);
    });
  }

  openFormDialog(reportSet?: ReportSetModel): void {
    if (!reportSet) {
      reportSet = new ReportSetModel();
    }

    const dialog = this.dialog.open(FormComponent, {
      data: {
        reportSet,
        reportTypes: this.reportTypes
      },
      width: '400px'
    })

    this.sub.add(dialog.afterClosed().subscribe(saved => {
      if (saved) {
        this.fetchItems();
      }
    }));
  }

  deleteReportSet(reportSetId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.reportSetService.deleteReportSet(reportSetId).then(response => {
          if (response) {
            const msg = this.t.transform('report_set_deleted');
            this.notificationService.success(msg);

            this.fetchItems();
          }
        });
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
