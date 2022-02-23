import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.styl']
})
export class ResultsComponent implements OnInit {

  dates: { start: string, end: string };

  results: {
    labels: [],
    rows: [];
    totals: []
  }

  constructor(private route: ActivatedRoute, private reportStateService: HistoricalReportsService) {}

  ngOnInit(): void {
    this.results = this.route.snapshot.data.results;
    this.dates = this.reportStateService.dates;
  }
}
