import { UserModel } from 'src/app/_shared/models/user.model';

export class UnitModel {
  _id: string;
  name?: string;
  admin?: string;
  externalID?: string;
  disabled?: boolean;
  checked?: boolean;
  isToggled?: boolean;
  loading?: boolean;
  units?: UnitModel[];
  users?: UserModel[];
  parent?: UnitModel | string;
  ancestors?: UnitModel[];
  hasUnits?: boolean;
  ignore?: boolean;
  
  constructor(values: Partial<UnitModel> = {}) {
    this._id = values._id || '';
    this.name = values.name || '';
    this.admin = values.admin || '';
    this.units = values.units || [];
  }
  
  static getParentId?(parent: string | UnitModel): string {
    return typeof parent === 'string' ? parent : parent?._id;
  }
}
