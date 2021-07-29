import { UserModel } from 'src/app/_shared/models/user.model';

export class UnitModel {
  id: any;
  name: string;
  adminId: number;
  externalID: string;
  disabled?: boolean;
  units: UnitModel[];
  users: UserModel[];
  parent: UnitModel;
}
