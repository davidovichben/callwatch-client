import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';


@NgModule({
  declarations: [
    DoughnutChartComponent,
    BarChartComponent,
    GaugeChartComponent
  ],
  exports: [
    DoughnutChartComponent,
    BarChartComponent,
    GaugeChartComponent
  ],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class ChartModule {}
