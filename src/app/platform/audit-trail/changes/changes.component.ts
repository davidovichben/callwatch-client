import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { AuditTrailEntryChangeModel } from 'src/app/_shared/models/audit-trail-entry-change.model';

@Component({
  selector: 'app-changes',
  templateUrl: './changes.component.html'
})
export class ChangesComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public changes: AuditTrailEntryChangeModel[]) {}
}
