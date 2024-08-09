import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from 'src/app/platform/dashboard/widgets-area/widget/widget.component';
import { ChartModule } from 'src/app/_shared/components/chart/charts.module';


@NgModule({
    declarations: [
        WidgetComponent
    ],
    exports: [
        WidgetComponent
    ],
    imports: [
        CommonModule,
        ChartModule
    ]
})
export class WidgetModule { }
