export class ModuleModel {
  name: string;
  permission: string;
  checked?: boolean;
  isOpen?: boolean;
  isToggled?: boolean;
  subModules?: ModuleModel[];
}
