import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { UnitModel } from 'src/app/_shared/models/unit.model';

export class ReportSetModel {
  id: number;
  name: string;
  reports: SelectItemModel[];
  units: UnitModel[];
}
