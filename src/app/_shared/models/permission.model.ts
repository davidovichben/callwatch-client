import { ModuleModel } from 'src/app/_shared/models/module.model';

export class PermissionModel {
  _id: string;
  name: string;
  description: string;
  userCount: number;
  modules: ModuleModel[];
}

export const PermissionModules = [
  'reports', 'timed_reports', 'users', 'switchboards',
  'routers', 'schedules', 'units', 'calls'
];

export const PermissionActions = ['read', 'create', 'update', 'delete'];
