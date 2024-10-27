import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FileSaverService } from 'ngx-filesaver';
import { Subscription } from 'rxjs';
import moment from 'moment';

import { InformationDialogComponent } from './information-dialog/information-dialog.component';
import { ColumnsDialogComponent } from './columns-dialog/columns-dialog.component';
import { QueryDialogComponent } from './query-dialog/query-dialog.component';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { AppStateService } from 'src/app/_shared/services/state/app-state.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { ReportsService } from 'src/app/_shared/services/http/reports.service';

import { ReportFormats, ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

import { ReportColumnModel } from 'src/app/_shared/models/report-column.model';
import { PaginationData } from 'src/app/_shared/components/data-table/classes/pagination-data';
import { WeekDays } from 'src/app/_shared/constants/general';
import { TranslatePipe } from '../../../../_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.sass']
})
export class ResultsComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();
  readonly formats = ReportFormats;

  weekDays = WeekDays;
  
  reportTemplate: ReportTemplateModel;
  dates: { start: string, end: string };
  timeSpace: string;
  criteria: ReportCriteriaModel;

  hasDateColumn = true;
  activeColumns: ReportColumnModel[];
  todayDate: string;

  reportTitle: string;
  
  // results: {
  //   labels: {
  //     titles: [],
  //     subTitles: [],
  //     columns: [],
  //     columnTypes: [],
  //   },
  //   rows: {
  //     items: [],
  //     total: number,
  //     lastPage: number
  //   },
  //   pageTotals: [],
  //   totals: []
  // }

  results = {
    headers: [],
    columns: {},
    rows: []
  };
  
  paginationData: PaginationData;

  styles = [];

  isReloading = false;
  isDownloading = false;

  query: string;

  isAdmin = false;

  constructor(private route: ActivatedRoute, private dialog: MatDialog,
              private router: Router,
              private appState: AppStateService, private reportsService: ReportsService,
              private reportStateService: HistoricalReportsService,
              private translate: TranslatePipe,
              private fileSaver: FileSaverService, private userSession: UserSessionService) {}

  ngOnInit(): void {
    this.isAdmin = this.userSession.getUser().isAdmin;

    this.criteria = this.reportStateService.getCriteria();
    
    this.setReportTitle();
    
    // this.setData();
    // this.setActiveColumns();
    // this.setStyles();
    this.appState.routeScrollDisabled = true;
    
    // this.sub.add(this.route.queryParams.subscribe(params => {
    //   if (params.page && this.paginationData.currentPage !== +params.page) {
    //     this.paginationData.currentPage = +params.page;
    //
    //     this.produce();
    //   }
    // }));
    
    this.route.queryParams.subscribe(async (queryParam) => {
      this.isReloading = true;
      
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
      
      this.results = await this.reportsService.getHistoricalResults(this.criteria);
      
      this.isReloading = false;
    });
  }
  
  setReportTitle(reportTitle?: string) {
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
    console.log(xls);
    if (xls) {
      this.fileSaver.save(xls, 'report.xls');
    }
  }
  
  sort(column: string, direction: 'desc' | 'asc'): void {
    // this.criteria.sort = [{ column: column, direction }];
    // this.produce();
  }
  
  ngOnDestroy(): void {
    this.appState.routeScrollDisabled = false;
    this.sub.unsubscribe();
  }
  
  // private setData(): void {
  //   const results = this.route.snapshot.data.results;
  //   this.results = results.report;
  //   this.query = results.query;
  //
  //   this.dates = this.reportStateService.dates;
  //   this.reportTemplate = this.reportStateService.getReportTemplate();
  //   this.timeSpace = this.reportStateService.getCriteria().timeSpace;
  //   this.criteria = this.reportStateService.getCriteria();
  //
  //   this.todayDate = moment().format('DD/MM/yy');
  //
  //   this.paginationData = {
  //     totalPages: this.results.rows.lastPage,
  //     totalItems: this.results.rows.total,
  //     currentPage: this.route.snapshot.queryParams.page ? +this.route.snapshot.queryParams.page : 1,
  //     limit: 50
  //   };
  // }
  //
  // private setActiveColumns(): void {
  //   this.hasDateColumn = true;
  //   if (this.criteria.columns) {
  //     this.activeColumns = this.reportTemplate.columns.filter(column => this.criteria.columns.includes(column.id));
  //     this.hasDateColumn = !!this.activeColumns.find(column => column.id === 'date');
  //   } else {
  //     this.activeColumns = this.reportTemplate.columns;
  //   }
  // }
  //
  // openInformationDialog(): void {
  //   this.dialog.open(InformationDialogComponent, {
  //     data: this.reportTemplate,
  //     width: '600px'
  //   });
  // }
  //
  // openColumnsDialog(): void {
  //   const availableColumns = this.reportTemplate.columns;
  //   const selectedColumns = this.criteria.columns ?? availableColumns.map(column => column.id);
  //
  //   const dialog = this.dialog.open(ColumnsDialogComponent, {
  //     data: { selected: selectedColumns, available: availableColumns }
  //   });
  //
  //   const sub = dialog.afterClosed().subscribe(newColumns => {
  //     if (newColumns) {
  //       this.criteria.columns = newColumns;
  //
  //       this.setActiveColumns();
  //       this.produce();
  //     }
  //   });
  //
  //   this.sub.add(sub);
  // }
  //
  // openQueryDialog(): void {
  //   this.dialog.open(QueryDialogComponent, {
  //     data: this.query,
  //     width: '600px',
  //     maxHeight: '600px'
  //   });
  // }
  //
  // produce(): void {
  //   if (!this.isProducing) {
  //     this.isProducing = true;
  //
  //     const reportTemplateId = this.reportStateService.getReportTemplate()?.id;
  //     this.reportService.produceReport(reportTemplateId, this.criteria, this.paginationData.currentPage).then(response => {
  //       if (response) {
  //         this.results = response.report;
  //         this.query = response.query;
  //         this.setStyles();
  //       }
  //
  //       this.isProducing = false;
  //     })
  //   }
  // }
  //
  // download(format: string): void {
  //   if (!this.isDownloading) {
  //     this.isDownloading = true;
  //
  //     const reportTemplate = this.reportStateService.getReportTemplate();
  //     this.reportService.exportReport(reportTemplate.id, this.criteria, format.toLowerCase()).then(response => {
  //       if (response) {
  //         this.fileSaver.save(response, reportTemplate.name + '.' + (format.toLowerCase()));
  //       }
  //
  //       this.isDownloading = false;
  //     })
  //   }
  // }
  //
  // setStyles(): void {
  //   this.results.rows.items.forEach((row: any[], rowIndex) => {
  //     const rowStyle = [];
  //
  //     for (let index = 1; index < row.length; index++) {
  //
  //       const column = this.activeColumns[index - 1];
  //
  //       if (column && column.conditionalDesign) {
  //         const value = row[index];
  //
  //         const design = column.conditionalDesign;
  //         if (design.equalTo?.value && design.equalTo.value == value) {
  //           rowStyle[index] = { backgroundColor: design.equalTo.color, color: '#fff' };
  //           continue;
  //         }
  //
  //         if (!isNaN(value)) {
  //           if (design.greaterThan?.value && design.greaterThan.value > value) {
  //             rowStyle[index] = { backgroundColor: design.greaterThan.color, color: '#fff' };
  //             continue;
  //           }
  //
  //           if (design.lessThan?.value && design.lessThan.value < value) {
  //             rowStyle[index] = { backgroundColor: design.lessThan.color, color: '#fff' };
  //             continue;
  //           }
  //
  //           if (design.between?.values && design.between.values.from <= +value && design.between.values.to >= +value) {
  //             rowStyle[index] = { backgroundColor: design.between.color, color: '#fff' };
  //             continue;
  //           }
  //         }
  //       }
  //
  //       rowStyle[index] = null;
  //     }
  //
  //     this.styles[rowIndex] = rowStyle;
  //   })
  // }
  //
}
