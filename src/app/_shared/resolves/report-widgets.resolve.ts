import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { ReportWidgetService } from 'src/app/_shared/services/http/report-widget.service';

import { ReportWidgetModel } from 'src/app/_shared/models/report-widget.model';

@Injectable()
export class ReportWidgetsResolve  {

	constructor(private reportWidgetService: ReportWidgetService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		return this.reportWidgetService.getReportWidgets().then(response => response as ReportWidgetModel[]);
	}
}
