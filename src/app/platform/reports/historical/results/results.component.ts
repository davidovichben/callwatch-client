import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { InformationDialogComponent } from './information-dialog/information-dialog.component';
import { ColumnsDialogComponent } from './columns-dialog/columns-dialog.component';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.styl']
})
export class ResultsComponent implements OnInit {

  dates: { start: string, end: string };
  timeSpace: string;

  results: {
    labels: [],
    rows: [];
    totals: []
  }

  isRefreshing = false;

  constructor(private route: ActivatedRoute, private dialog: MatDialog,
              private reportService: ReportTemplateService,
              private reportStateService: HistoricalReportsService) {}

  ngOnInit(): void {
    this.results = this.route.snapshot.data.results;
    this.dates = this.reportStateService.dates;
    this.timeSpace = this.reportStateService.getCriteria().timeSpace;
  }

  openInformationDialog(): void {
    this.dialog.open(InformationDialogComponent);
  }

  openColumnsDialog(): void {
    this.dialog.open(ColumnsDialogComponent);
  }

  refreshResults(): void {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      const reportTemplateId = this.reportStateService.getReportTemplate().id;
      const criteria = this.reportStateService.getCriteria();
      this.reportService.produceReport(reportTemplateId, criteria).then(response => {
        if (response) {
          this.results = response;
        }

        this.isRefreshing = false;
      })
    }
  }
}
