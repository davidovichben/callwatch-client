import { ModuleModel } from 'src/app/_shared/models/module.model';

export class PermissionModel {
  _id: string;
  name: string;
  description: string;
  userCount: number;
  modules: ModuleModel[];
}

export const PermissionModules = ['users', 'units', 'mailServers', 'mailBoxes', 'keywords'];

export const PermissionActions = ['read', 'create', 'update', 'delete'];
