import { UnitModel } from 'src/app/_shared/models/unit.model';

export class ExtensionGroupModel {
  unit: UnitModel;
  switchboard: number;
  router: number;
  extensions: number[];
  acds: number[];
}
