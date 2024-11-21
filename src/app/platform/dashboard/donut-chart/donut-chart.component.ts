import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '../../../_shared/pipes/translate/translate.module';

import { ReportRealtimeResult } from '../../../_shared/models/report-realtime-results.model';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [
    TranslateModule,
    NgClass,
    MatIcon,
    NgIf
  ],
  templateUrl: './donut-chart.component.html',
  styleUrls: [
    './donut-chart.component.sass',
    '../dashboard.component.sass'
  ]
})
export class DonutChartComponent {
  @Input() totalStat: ReportRealtimeResult;
  @Input() firstStat: ReportRealtimeResult;
  @Input() secondStat: ReportRealtimeResult;
  @Input() labels: {
    ['main']: string,
    ['firstStat']: string,
    ['secondStat']: string
  };
  
  getChartColors(): string {
    const percentage = this.totalStat.value > 0 ? ((this.firstStat.value / this.totalStat.value) * 100).toFixed(2) : 0;
    return 'conic-gradient(#FFA726 var(--percentage, 0%) 0%, #605DFF var(--percentage, 0%) ' + percentage + '%, #FFA726 var(--percentage, 0%) 100%';
  }
}
