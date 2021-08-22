import { PermissionEntityModel } from 'src/app/_shared/models/permission-entity.model';

export class UnitModel {
  id: any;
  name: string;
  adminId?: number;
  externalID?: string;
  disabled?: boolean;
  units: UnitModel[];
  users?: PermissionEntityModel[];
  groups?: PermissionEntityModel[];
  parent?: UnitModel;
}
