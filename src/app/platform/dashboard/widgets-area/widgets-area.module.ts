import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDragResizeModule } from 'ngx-drag-resize';
import { WidgetModule } from 'src/app/platform/dashboard/widgets-area/widget/widget.module';
import { ChartModule } from 'src/app/_shared/components/chart/charts.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropModule } from "@angular/cdk/drag-drop";

import { WidgetsAreaComponent } from './widgets-area.component';



@NgModule({
  declarations: [
    WidgetsAreaComponent
  ],
  exports: [
    WidgetsAreaComponent
  ],
  imports: [
    CommonModule,
    NgxDragResizeModule,
    WidgetModule,
    ChartModule,
    MatGridListModule,
    DragDropModule
  ]
})
export class WidgetsAreaModule {}
