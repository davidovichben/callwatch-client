import { UserModel } from 'src/app/_shared/models/user.model';

export class UnitModel {
  _id: string;
  name?: string;
  admin?: string;
  externalID?: string;
  disabled?: boolean;
  checked?: boolean;
  toggled?: boolean;
  units?: UnitModel[];
  users?: UserModel[];
  parent?: UnitModel;
  ancestors?: UnitModel[];
  hasUnits?: boolean;
  ignore?: boolean;
  playCallback?: boolean;
}
