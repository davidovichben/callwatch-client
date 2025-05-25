import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReportsService } from 'src/app/_shared/services/http/reports.service';
import { ReportRealtimeResultsModel } from '../../_shared/models/report-realtime-results.model';
import { RealtimeReportInterval } from '../../_shared/models/report-criteria.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  readonly kpis = [
    {
      title: 'conversation_count',
      value: 'conversationsCount'
    },
    {
      title: 'average_response_time',
      value: 'averageResponseTime'
    },
    {
      title: 'number_of_mails_per_conversation',
      value: 'messagesCount'
    },
    {
      title: 'mailbox_count',
      value: 'mailboxesCount'
    }
  ];
  
  reportCriteriaInterval = RealtimeReportInterval.day;
  loadingInterval: any;
  
  results: ReportRealtimeResultsModel;
  
  constructor(private route: ActivatedRoute, private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.results = this.route.snapshot.data.results;
    
    this.setResultsInterval();
  }
  
  setResultsInterval() {
    this.loadingInterval = setInterval(async () => {
      this.results = await this.reportsService.getRealtimeResults(this.reportCriteriaInterval);
    }, 5000);
  }
  
  async changeInterval(interval: RealtimeReportInterval) {
    this.reportCriteriaInterval = interval;
    this.results = await this.reportsService.getRealtimeResults(this.reportCriteriaInterval);
  }
  
  ngOnDestroy() {
    clearInterval(this.loadingInterval);
  }
}
