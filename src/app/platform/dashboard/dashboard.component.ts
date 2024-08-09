import { Component, OnInit } from '@angular/core';

import { StatsModel } from '../../_shared/models/stats.model';
import { ActivatedRoute } from '@angular/router';
import { StatsService } from '../../_shared/services/http/stats.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  
  statsLoadingInterval: any;
  
  stats: StatsModel;
  
  constructor(private route: ActivatedRoute, private statsService: StatsService) {}

  ngOnInit(): void {
    this.stats = this.route.snapshot.data.stats;
    
    this.loadData();
  }
  
  loadData() {
    // this.statsLoadingInterval = setInterval(async () => {
    //   this.stats = await this.statsService.getStats();
    // }, 5000);
  }
  
  ngOnDestroy() {
    clearInterval(this.statsLoadingInterval);
  }
}
