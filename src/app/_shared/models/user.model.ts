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
  avatar: string;
  authType: string;
  locale: string;
  unit: string;
  email: string;
  units: UnitModel[] | 'root';
}

export const AuthTypes = ['ldap', 'cerberus'];
