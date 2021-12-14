import { UserModel } from 'src/app/_shared/models/user.model';

export class UnitModel {
  id: any;
  name?: string;
  admin?: string;
  externalID?: string;
  switchboard: number;
  router: number;
  extensions: number[];
  acds: number[];
  disabled?: boolean;
  checked?: boolean;
  toggled?: boolean;
  units?: UnitModel[];
  users?: UserModel[];
  parent?: UnitModel;
  ancestors?: UnitModel[];
  hasUnits?: boolean;

  isRoot(): boolean {
    return this.id === 'root';
  }
}
