import { UnitModel } from 'src/app/_shared/models/unit.model';

export class GroupModel {
  id: number;
  name: string;
  totalMembers: number;
  permission: string;
  units: UnitModel[] | 'root';
}
