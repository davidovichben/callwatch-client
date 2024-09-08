import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InsightsService } from '../../_shared/services/http/insights.service';

import { InsightsModel } from '../../_shared/models/insights.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  loadingInterval: number;
  
  insights: any;
  
  constructor(private route: ActivatedRoute, private insightsService: InsightsService) {}

  ngOnInit(): void {
    this.insights = this.route.snapshot.data.insights;
    
    this.loadData();
  }
  
  loadData() {
    this.loadingInterval = setInterval(async () => {
      this.insights = await this.insightsService.getLatestInsights();
    }, 5000);
  }
  
  ngOnDestroy() {
    clearInterval(this.loadingInterval);
  }
}
