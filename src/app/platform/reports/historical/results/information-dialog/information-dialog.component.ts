import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html'
})
export class InformationDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public reportTemplate: ReportTemplateModel) {}
}
