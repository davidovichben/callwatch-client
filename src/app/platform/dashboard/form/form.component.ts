import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { WidgetFormComponent } from './widget-form/widget-form.component';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ReportWidgetModel } from 'src/app/_shared/models/report-widget.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.styl']
})
export class FormComponent implements OnInit {

  reportModules: SelectItemModel[] = [];

  widgets: ReportWidgetModel[] = [];

  constructor(private dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.reportModules = this.route.snapshot.data.reportModules;
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.boxes, event.previousIndex, event.currentIndex);
  // }

  openWidgetFormDialog(): void {
    this.dialog.open(WidgetFormComponent, {
      data: { reportModules: this.reportModules },
      height: '850px',
      width: '800px'
    })
  }
}
