import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsAreaComponent } from './widgets-area.component';
import { NgxDragResizeModule } from 'ngx-drag-resize';
import { WidgetModule } from 'src/app/platform/dashboard/widgets-area/widget/widget.module';
import { ChartModule } from 'src/app/_shared/components/chart/charts.module';
import { MatGridListModule } from '@angular/material/grid-list';



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
        MatGridListModule
    ]
})
export class WidgetsAreaModule { }
