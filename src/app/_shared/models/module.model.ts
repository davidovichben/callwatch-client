export class ModuleModel {
  name: string;
  checked?: boolean;
  isOpen?: boolean;
  isToggled?: boolean;
  subModules?: ModuleModel[];
}
