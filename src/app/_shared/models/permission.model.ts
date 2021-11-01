import { ModuleModel } from 'src/app/_shared/models/module.model';

export class PermissionModel {
  id: number;
  name: string;
  description: string;
  modules: ModuleModel[];
}

export const PermissionModules = [
  'reports', 'timed_reports', 'users', 'campaigns', 'routers', 'schedules', 'units', 'calls'
];

export const PermissionActions = ['read', 'create', 'update', 'delete'];
