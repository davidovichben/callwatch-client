import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
import { Subscription } from 'rxjs';

import { DataTableComponent } from '../../../../_shared/components/data-table/data-table.component';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
import { AppStateService } from 'src/app/_shared/services/state/app-state.service';
import { ReportsService } from 'src/app/_shared/services/http/reports.service';

import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

import { TranslatePipe } from '../../../../_shared/pipes/translate/translate.pipe';

import { ReportResultsModel } from '../../../../_shared/models/report-results.model';
import { DataTableColumn } from '../../../../_shared/components/data-table/classes/data-table-column';
import { WeekDays } from '../../../../_shared/constants/general';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;
  
  readonly sub = new Subscription();
  
  readonly drillDownColumns = ['unitsCount', 'mailboxesCount', 'unit', 'mailbox'];
  
  readonly weekDays = WeekDays;
  
  criteria: ReportCriteriaModel;
  
  reportTitle: string;
  
  results: ReportResultsModel;
  
  constructor(private route: ActivatedRoute, private appState: AppStateService,
              private reportsService: ReportsService, private reportStateService: HistoricalReportsService,
              private translate: TranslatePipe, private fileSaver: FileSaverService) {}

  ngOnInit(): void {
    this.criteria = this.reportStateService.getCriteria();
    
    this.setReportTitle();
    
    this.appState.routeScrollDisabled = true;
    
    this.route.queryParams.subscribe(async (queryParam) => {
      this.criteria.groupBy = null;
      
      if (queryParam.view === 'units') {
        this.criteria.groupBy = 'units';
      }
      
      if (queryParam.view === 'mailboxes') {
        this.criteria.groupBy = 'mailboxes';
      }
      
      if (queryParam.view === 'unit') {
        this.criteria.groupBy = 'unit';
        this.criteria.unitId = queryParam._id;
      }
      
      if (queryParam.view === 'mailbox') {
        this.criteria.groupBy = 'mailbox';
        this.criteria.mailboxId = queryParam._id;
      }
      
      this.setReportTitle(queryParam.title);
    });
  }
  
  async fetchItems(): Promise<void> {
    this.results = await this.reportsService.getHistoricalResults(this.criteria);
    
    this.dataTable.setItems({ total: this.results.total, items: this.results.items, lastPage: this.results.lastPage, columnLength: this.results.headers.length });
  }
  
  setReportTitle(reportTitle?: string) {
    this.reportTitle = this.translate.transform('conversations_report');
    
    if (this.criteria.startDate && this.criteria.endDate) {
      this.reportTitle = this.translate.transform('report');
    }
    
    if (this.criteria.groupBy === 'units') {
      this.reportTitle = this.translate.transform('units_report');
    }
    
    if (this.criteria.groupBy === 'mailboxes') {
      this.reportTitle = this.translate.transform('mailboxes_report');
    }
    
    if (reportTitle) {
      this.reportTitle = this.translate.transform('report_for') + reportTitle;
    }
    
    if (this.criteria.startDate && this.criteria.endDate) {
      this.reportTitle += ' ' + this.translate.transform('for_dates');
    }
  }
  
  async exportXls() {
    const xls = await this.reportsService.exportReport(this.criteria);
    if (xls) {
      this.fileSaver.save(xls, 'report.xls');
    }
  }

  ngOnDestroy(): void {
    this.appState.routeScrollDisabled = false;
    this.sub.unsubscribe();
  }
}
