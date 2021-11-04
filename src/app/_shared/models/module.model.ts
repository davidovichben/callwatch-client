export class ModuleModel {
  name: string;
  checked?: boolean;
  isGuarded?: boolean;
  isToggled?: boolean;
  subModules?: ModuleModel[];
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}
