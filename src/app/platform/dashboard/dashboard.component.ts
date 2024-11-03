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
      label: 'conversation_count',
      trend: 8,
      value: 'conversationsCount'
    },
    {
      label: 'average_response_time',
      trend: -3.3,
      value: 'averageResponseTime'
    },
    {
      label: 'number_of_mails_per_conversation',
      trend: 1.5,
      value: 'messagesCount'
    },
    {
      label: 'mailbox_count',
      value: 'mailboxesCount'
    }
  ];
  
  reportCriteriaInterval = RealtimeReportInterval.day;
  loadingInterval: any;
  
  results: ReportRealtimeResultsModel;
  
  constructor(private route: ActivatedRoute, private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.results = this.route.snapshot.data.results;
    
    this.loadData();
  }
  
  loadData() {
    this.loadingInterval = setInterval(async () => {
      this.results = await this.reportsService.getRealtimeResults(this.reportCriteriaInterval);
    }, 5000);
  }
  
  ngOnDestroy() {
    clearInterval(this.loadingInterval);
  }
}
