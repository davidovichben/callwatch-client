import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FileSaverService } from 'ngx-filesaver';

import { InformationDialogComponent } from './information-dialog/information-dialog.component';
import { ColumnsDialogComponent } from './columns-dialog/columns-dialog.component';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

import { ReportFormats } from 'src/app/_shared/models/report-template.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.styl']
})
export class ResultsComponent implements OnInit {

  readonly formats = ReportFormats;

  dates: { from: string, to: string };
  timeSpace: string;

  results: {
    labels: [],
    rows: [];
    totals: []
  }

  isProducing = false;
  isDownloading = false;

  constructor(private route: ActivatedRoute, private dialog: MatDialog,
              private reportService: ReportTemplateService,
              private reportStateService: HistoricalReportsService,
              private fileSaver: FileSaverService) {}

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

  produce(): void {
    if (!this.isProducing) {
      this.isProducing = true;

      const reportTemplateId = this.reportStateService.getReportTemplate()?.id;
      const criteria = this.reportStateService.getCriteria();
      this.reportService.produceReport(reportTemplateId, criteria).then(response => {
        if (response) {
          this.results = response;
        }

        this.isProducing = false;
      })
    }
  }

  download(format: string): void {
    if (!this.isDownloading) {
      this.isDownloading = true;

      const reportTemplate = this.reportStateService.getReportTemplate();
      const criteria = this.reportStateService.getCriteria();
      this.reportService.exportReport(reportTemplate.id, criteria, format.toLowerCase()).then(response => {
        if (response) {
          this.fileSaver.save(response, reportTemplate.name + '.' + format);
        }

        this.isDownloading = false;
      })
    }
  }
}
