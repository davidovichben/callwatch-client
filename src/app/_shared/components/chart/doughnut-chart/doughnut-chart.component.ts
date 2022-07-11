import { Component, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color, Colors } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.less']
})
export class DoughnutChartComponent {
  @Input() doughnutChartLabels: Label[] = ['BMW', 'Ford', 'Tesla'];
  @Input() doughnutChartData: MultiDataSet = [
    [55, 25, 20]
  ];
  @Input() doughnutChartType: ChartType = 'doughnut';
  @Input() lineChartColors: Colors[] = [
    {
      data: [1, 2],
      borderColor: 'black',
      backgroundColor: 'rgb(134,43,246)'
    },
    {
      data: [3],
      borderColor: 'black',
      backgroundColor: 'rgb(43,70,246)'
    },
  ];
}
