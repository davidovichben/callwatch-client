import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { AuditTrailEntryChangeModel } from 'src/app/_shared/models/audit-trail-entry-change.model';
import { TranslateModule } from '../../../_shared/pipes/translate/translate.module';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-changes',
  templateUrl: './changes.component.html',
  imports: [
    MatDialogClose,
    TranslateModule,
    NgForOf
  ],
  standalone: true
})
export class ChangesComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public changes: AuditTrailEntryChangeModel[]) {}
}
