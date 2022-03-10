export class AuditLogEntryModel {
  created: string;
  username: string;
  action: string;
  resourceType: string;
  resourceName: string;
  resourceId: number;
  ip: string;
}
