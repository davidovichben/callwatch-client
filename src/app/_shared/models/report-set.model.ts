import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

export class ReportSetModel {
  id: number;
  name: string;
  reports: SelectItemModel[];
  users: SelectItemModel[];
  groups: SelectItemModel[];
}
