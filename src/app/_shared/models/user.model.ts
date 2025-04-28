import { UnitModel } from 'src/app/_shared/models/unit.model';
import { LanguageModel } from 'src/app/_shared/models/language.model';

export class UserModel {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  token?: string;
  permission?: any;
  permissions?: any;
  isAdmin?: boolean;
  avatar?: string;
  language?: LanguageModel;
  unit?: string;
  email?: string;
  units?: UnitModel[] | 'root';
}

export const AuthTypes = ['ldap', 'kerberos'];
