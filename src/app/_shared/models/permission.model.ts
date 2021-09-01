import { ModuleModel } from 'src/app/_shared/models/module.model';

export class PermissionModel {
  id: number;
  name: string;
  modules: ModuleModel[];
}

export const PermissionActions = ['read', 'create', 'update', 'delete'];
