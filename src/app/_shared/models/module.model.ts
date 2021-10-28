export class ModuleModel {
  name: string;
  checked?: boolean;
  isGuarded?: boolean;
  isToggled?: boolean;
  subModules?: ModuleModel[];
}
