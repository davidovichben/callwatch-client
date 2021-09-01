export class ModuleModel {
  name: string;
  checked?: boolean;
  isGuarded?: boolean;
  subModules?: ModuleModel[];
}
