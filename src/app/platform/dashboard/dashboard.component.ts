import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReportsService } from 'src/app/_shared/services/http/reports.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  loadingInterval: number;
  
  results: any;
  
  kpis = [
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
      value: 'messages_count'
    },
    {
      label: 'mailbox_count',
      value: 'mailbox_count'
    }
  ];
  
  constructor(private route: ActivatedRoute, private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.results = this.route.snapshot.data.results;
    
    console.log(this.results)
    
    this.loadData();
  }
  
  loadData() {
    this.loadingInterval = setInterval(async () => {
      this.results = await this.reportsService.getTodayResults();
    }, 5000);
  }
  
  ngOnDestroy() {
    clearInterval(this.loadingInterval);
  }
}
