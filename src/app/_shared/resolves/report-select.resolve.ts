import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ReportService } from 'src/app/_shared/services/http/report.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class ReportSelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private reportService: ReportService) {}

  resolve() {
    return this.reportService.selectReports().then(response => response as SelectItemModel[]);
  }
}
