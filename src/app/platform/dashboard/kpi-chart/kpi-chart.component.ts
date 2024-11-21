import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';

import { TranslateModule } from '../../../_shared/pipes/translate/translate.module';
import { ReportRealtimeResult } from '../../../_shared/models/report-realtime-results.model';

@Component({
  selector: 'app-kpi-chart',
  standalone: true,
  imports: [
    MatIcon,
    NgIf,
    TranslateModule,
    NgClass
  ],
  templateUrl: './kpi-chart.component.html',
  styleUrl: '../dashboard.component.sass'
})
export class KpiChartComponent {
  @Input() result: ReportRealtimeResult;
  @Input() labels: {
    ['title']: string,
    ['valueDesc']: string,
    ['footer']: string
  };
}
