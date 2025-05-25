import { ModuleModel } from 'src/app/_shared/models/module.model';

export class PermissionModel {
  _id: string;
  name: string;
  description: string;
  userCount: number;
  modules: ModuleModel[];
}

export const PermissionModules = ['users', 'units', 'mailServers', 'mailBoxes', 'keywords'];

/**
 * Permission action constants
 */
export const permissionActions = {
  ALL: 'all',
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
};

/**
 * Permission action metadata
 */
export const permissionActionsMeta = {
  [permissionActions.READ]: {
    label: 'view',
    icon: 'visibility'
  },
  [permissionActions.CREATE]: {
    label: 'create',
    icon: 'add_circle'
  },
  [permissionActions.UPDATE]: {
    label: 'edit',
    icon: 'edit'
  },
  [permissionActions.DELETE]: {
    label: 'delete',
    icon: 'delete'
  }
};
