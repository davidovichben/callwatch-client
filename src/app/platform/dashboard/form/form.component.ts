import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { WidgetFormComponent } from './widget-form/widget-form.component';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass']
})
export class FormComponent implements OnInit {

  reportModules: SelectItemModel[] = [];

  constructor(private dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.reportModules = this.route.snapshot.data.reportModules;
  }

  openWidgetFormDialog(): void {
    this.dialog.open(WidgetFormComponent, {
      data: { reportModules: this.reportModules },
      height: '850px',
      width: '800px'
    })
  }

  saveWidgetsGrid(): void {
  }
}
