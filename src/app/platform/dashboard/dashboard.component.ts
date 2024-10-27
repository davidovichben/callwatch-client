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
