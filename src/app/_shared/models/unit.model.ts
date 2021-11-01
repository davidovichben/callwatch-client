import { UserModel } from 'src/app/_shared/models/user.model';

export class UnitModel {
  id: any;
  name?: string;
  admin?: string;
  externalID?: string;
  disabled?: boolean;
  checked?: boolean;
  units?: UnitModel[];
  users?: UserModel[];
  parent?: UnitModel;
}
