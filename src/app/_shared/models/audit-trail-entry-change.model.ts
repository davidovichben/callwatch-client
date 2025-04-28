import { AuditTrailEntryModel } from 'src/app/_shared/models/audit-trail-entry.model';

export class AuditTrailEntryChangeModel {
  entry?: AuditTrailEntryModel;
  attribute: string;
  oldValue: string;
  newValue: string;
}
