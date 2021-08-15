import { UnitModel } from 'src/app/_shared/models/unit.model';

export class UserModel {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  name: string;
  token: string;
  permission: any;
  isAdmin: boolean;
  isRoot: boolean;
  logo: File;
  unit: UnitModel;
}

export const AuthTypes = ['Ldap', 'Cerberus'];
